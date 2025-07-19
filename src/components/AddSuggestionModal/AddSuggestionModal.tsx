import React, { useState, useEffect } from 'react';
import './AddSuggestionModal.css';
import axios from 'axios';
import { getDatabaseUrl } from '../../services/api';
import ExerciseRecommendationsModal from '../ExerciseRecommendationsModal/ExerciseRecommendationsModal';

interface AddSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SuggestionData {
    goal: string;
    suggestions: string[];
}

interface PhysicalAssessment {
    id: string;
    timestamp: string;
    formData: {
        age: string;
        gender: string;
        height: string;
        weight: string;
        EnergyLevels: string;
        PhysicalActivity: string;
        SittingTime: string;
        CardiovascularHealth: string;
        MuscleStrength: string;
        Flexibility: string;
        Balance: string;
        Thirsty: string;
        PainOrDiscomfort: string;
        AvailableTime: string;
        Diabetic_Risk: string;
    };
    physicalRiskPrediction: number[][][];
}

interface UserData {
    formData: PhysicalAssessment['formData'];
    physicalRiskPrediction: number[][][];
}

const AddSuggestionModal: React.FC<AddSuggestionModalProps> = ({ isOpen, onClose }) => {
    const [goal, setGoal] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [recommendations, setRecommendations] = useState<any>(null);

    const determineGoal = (userData: UserData): string => {
        const { weight, EnergyLevels, PhysicalActivity, Diabetic_Risk } = userData.formData;

        // Example conditions for different goals
        if (parseInt(weight) > 80 && parseFloat(EnergyLevels) < 5) {
            return 'weight_loss';
        }
        if (parseInt(weight) < 60 && parseFloat(EnergyLevels) > 7) {
            return 'muscle_gain';
        }
        if (parseFloat(PhysicalActivity) < 3) {
            return 'flexibility';
        }
        if (parseFloat(PhysicalActivity) > 7) {
            return 'endurance';
        }
        if (parseFloat(Diabetic_Risk) > 0.5) {
            return 'diabetes_management';
        }

        // Default goal if no specific conditions are met
        return 'general_fitness';
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem('userData');
                if (!storedUser) return;

                const { email } = JSON.parse(storedUser);
                const response = await fetch(getDatabaseUrl(`/users?email=${email}`));
                const userResponseData = await response.json();

                if (userResponseData && userResponseData.length > 0) {
                    const user = userResponseData[0];
                    console.log(user);
                    if (user.physicalAssessments && user.physicalAssessments.length > 0) {
                        const latestAssessment = user.physicalAssessments
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

                        const userData = {
                            formData: latestAssessment.formData,
                            physicalRiskPrediction: latestAssessment.physicalRiskPrediction
                        };

                        setUserData(userData);
                        setGoal(determineGoal(userData)); // Set the goal based on user data
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!userData) {
                throw new Error('User data not available');
            }

            // Convert physical risk to decimal (0-1)
            const physicalRisk = Array.isArray(userData.physicalRiskPrediction)
                ? userData.physicalRiskPrediction[0][0][0] / 100
                : 0;

            // Convert diabetes risk to decimal (0-1)
            const diabetesRisk = parseFloat(userData.formData.Diabetic_Risk) / 100;

            const requestData = {
                age: parseInt(userData.formData.age),
                height: parseInt(userData.formData.height),
                weight: parseInt(userData.formData.weight),
                energy_levels: parseFloat(userData.formData.EnergyLevels),
                physical_activity: parseFloat(userData.formData.PhysicalActivity),
                sitting_time: userData.formData.SittingTime,
                available_time: parseInt(userData.formData.AvailableTime),
                physical_activity_risk: physicalRisk, // Now in decimal form (e.g., 0.36 for 36%)
                diabetes_risk: diabetesRisk, // Now in decimal form (e.g., 0.36 for 36%)
                gender: parseFloat(userData.formData.gender),
                pain_or_discomfort: userData.formData.PainOrDiscomfort,
                cardiovascular_health: userData.formData.CardiovascularHealth,
                muscle_strength: userData.formData.MuscleStrength,
                flexibility: userData.formData.Flexibility,
                balance: userData.formData.Balance,
                goal: goal,
                user_prompt: suggestion
            };

            const response = await axios.post('http://127.0.0.1:5000/exerciserecommendations', requestData);

            // Save recommendations to database
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const userResponse = await fetch(getDatabaseUrl(`/users?email=${email}`));
                const userData = await userResponse.json();

                if (userData && userData.length > 0) {
                    const userId = userData[0].id;
                    const newRecommendation = {
                        id: Date.now().toString(),
                        timestamp: new Date().toISOString(),
                        recommendations: response.data.recommendations
                    };

                    const updatedUser = {
                        ...userData[0],
                        physical_activity_recommendations: [
                            ...(userData[0].physical_activity_recommendations || []),
                            newRecommendation
                        ]
                    };

                    await fetch(getDatabaseUrl(`/users/${userId}`), {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedUser)
                    });
                }
            }

            // Set recommendations and show the modal
            setRecommendations(response.data.recommendations);
            setShowRecommendations(true);
        } catch (error) {
            console.error('Error getting recommendations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseRecommendations = () => {
        setShowRecommendations(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="suggestion-modal-overlay">
            <div className="suggestion-modal-content">
                <button className="suggestion-modal-close-icon" onClick={onClose} type="button">
                    &times;
                </button>
                <div className="suggestion-modal-header">
                    <h2>Get Exercise Recommendations</h2>
                </div>
                <form className="suggestion-modal-form" onSubmit={handleSubmit}>
                    <div className="suggestion-modal-mb-3">
                        <label className="suggestion-modal-form-label">Additional Information</label>
                        <input
                            type="text"
                            className="suggestion-modal-form-control"
                            value={suggestion}
                            onChange={(e) => setSuggestion(e.target.value)}
                            placeholder="Enter any specific requirements or preferences..."
                        />
                        <small className="suggestion-modal-prompt">
                            Example: "I’m overweight and just starting out. I need very simple exercises I can do at home."
                        </small>
                    </div>


                    <div className="suggestion-modal-button-group">
                        <button
                            className="suggestion-modal-btn-primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Generating...' : 'Get Recommendations'}
                        </button>
                        <button
                            className="suggestion-modal-close-btn"
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
            {showRecommendations && recommendations && (
                <ExerciseRecommendationsModal
                    isOpen={showRecommendations}
                    onClose={handleCloseRecommendations}
                    recommendations={recommendations}
                />
            )}
        </div>
    );
};

export default AddSuggestionModal; 