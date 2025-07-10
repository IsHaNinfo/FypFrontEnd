import React, { useState, useEffect } from 'react';
import "./mentalrisk.css";
import axios from 'axios';
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from '../../services/api';

interface MentalRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    age: string;
    gender: string;
    Perceived_Control: string;
    Stress_Freq_Intensity: string;
    Emotional_Reg: string;
    Physical_Stress: string;
    Cognitive_Stress: string;
    Behavioral_Response: string;
    Work_Stress: string;
    Productivity: string;
    Suicidal_Thoughts: string;
    FreeTime: string;
    image: File | null;
    Diabetic_Risk: string;
}

interface MentalAssessment {
    id: string;
    timestamp: string;
    formData: FormData;
    prediction: {
        ML_Output: string;
        DL_Output: string;
        Scenario: string;
    };
    feature_contributions?: {
        Perceived_Control: number;
        Stress_Freq_Intensity: number;
        Emotional_Reg: number;
        Physical_Stress: number;
        Cognitive_Stress: number;
        Behavioral_Response: number;
        Work_Stress: number;
        Productivity: number;
        Suicidal_Thoughts: number;
        FreeTime: number;
        DiabetesRisk: number;
    };
}


const MentalRiskModal: React.FC<MentalRiskModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        age: '',
        gender: '',
        Perceived_Control: '',
        Stress_Freq_Intensity: '',
        Emotional_Reg: '',
        Physical_Stress: '',
        Cognitive_Stress: '',
        Behavioral_Response: '',
        Work_Stress: '',
        Productivity: '',
        Suicidal_Thoughts: '',
        FreeTime: '',
        image: null,
        Diabetic_Risk: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState<{
        ML_Output: string;
        DL_Output: string;
        Scenario: string;
    } | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) return;

                const { email } = JSON.parse(userData);
                const response = await axios.get(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_EMAIL(email)));
                const users = response.data;

                if (users && users.length > 0) {
                    const user = users[0];
                    const latestAssessment = user.diabeticAssessments?.[user.diabeticAssessments.length - 1];

                    if (latestAssessment && latestAssessment.formData) {
                        const { age, gender } = latestAssessment.formData;
                        const diabeticRisk = latestAssessment.prediction?.toString() || '0';

                        setFormData(prev => ({
                            ...prev,
                            age: age || '',
                            gender: gender || '',
                            Diabetic_Risk: diabeticRisk
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateUserAssessment = async (assessment: MentalAssessment) => {
        try {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                throw new Error("User not logged in");
            }

            const { email } = JSON.parse(userData);
            const userResponse = await axios.get(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_EMAIL(email)));
            const users = userResponse.data;

            if (!users || users.length === 0) {
                throw new Error("User not found");
            }

            const user = users[0];
            const latestDiabeticAssessment = user.diabeticAssessments?.[user.diabeticAssessments.length - 1];
            const diabeticRisk = latestDiabeticAssessment?.prediction?.toString() || '0';

            const newMentalAssessment = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                formData: {
                    ...formData,
                    Diabetic_Risk: diabeticRisk
                },
                prediction: assessment.prediction,
                feature_contributions: assessment.feature_contributions
            };

            const updatedUser = {
                ...user,
                mentalAssessments: [
                    ...(user.mentalAssessments || []),
                    newMentalAssessment
                ]
            };

            const response = await axios.put(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_ID(user.id)), updatedUser);
            return response.data;
        } catch (error) {
            console.error('Error updating assessment:', error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const currentUser = localStorage.getItem('userData');
            if (!currentUser) {
                throw new Error("User not logged in");
            }

            const formDataToSend = new FormData();
            formDataToSend.append("Perceived_Control", formData.Perceived_Control);
            formDataToSend.append("Stress_Freq_Intensity", formData.Stress_Freq_Intensity);
            formDataToSend.append("Emotional_Reg", formData.Emotional_Reg);
            formDataToSend.append("Physical_Stress", formData.Physical_Stress);
            formDataToSend.append("Cognitive_Stress", formData.Cognitive_Stress);
            formDataToSend.append("Behavioral_Response", formData.Behavioral_Response);
            formDataToSend.append("Work_Stress", formData.Work_Stress);
            formDataToSend.append("Productivity", formData.Productivity);
            formDataToSend.append("Suicidal_Thoughts", formData.Suicidal_Thoughts);
            formDataToSend.append("FreeTime", formData.FreeTime);
            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            const response = await axios.post(
                getAiModelUrl(API_CONFIG.AI_MODEL.ENDPOINTS.MENTAL_RISK_PREDICTION),
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setPrediction(response.data);

            const assessment: MentalAssessment = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                formData: {
                    ...formData,
                    Diabetic_Risk: formData.Diabetic_Risk
                },
                prediction: response.data.prediction,
                feature_contributions: response.data.feature_contributions
            };

            await updateUserAssessment(assessment);

            window.dispatchEvent(new CustomEvent('mentalAssessmentUpdated', {
                detail: {
                    prediction: response.data.prediction,
                    featureContributions: response.data.feature_contributions
                }
            }));

            setShowResult(true);
            onClose();
        } catch (error: any) {
            console.error("Error:", error);
            if (error.message === "User not logged in") {
                alert("Please log in to save your assessment.");
            } else if (error.code === 'ERR_NETWORK') {
                alert("Cannot connect to the server. Please make sure the backend server is running.");
            } else if (error.response) {
                alert(`Error: ${error.response.data.error || 'Server error occurred'}`);
            } else if (error.request) {
                alert("No response received from server. Please try again.");
            } else {
                alert("Error: " + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="mental-modal-overlay">
            <div className="mental-modal-content">
                <button className="mental-modal-close-icon" onClick={onClose} type="button">
                    &times;
                </button>
                <div className='mental-modal-header'>
                    <h2>Mental Health Risk Assessment</h2>
                </div>
                <form className="mental-modal-form" onSubmit={handleSubmit}>
                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            How much control do you feel you have over your daily tasks? (1-5)
                        </label>
                        <select
                            className="form-control"
                            name="Perceived_Control"
                            value={formData.Perceived_Control}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Level</option>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            How often do you feel stressed during the week?
                        </label>
                        <select
                            className="form-control"
                            name="Stress_Freq_Intensity"
                            value={formData.Stress_Freq_Intensity}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="Rarely (0-1 times)">Rarely (0-1 times)</option>
                            <option value="Sometimes (2-3 times)">Sometimes (2-3 times)</option>
                            <option value="Often (4-5 times)">Often (4-5 times)</option>
                            <option value="Always (6+ times)">Always (6+ times)</option>
                        </select>
                    </div>

                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            Over the past two weeks, how often have you felt down or hopeless?
                        </label>
                        <select
                            className="form-control"
                            name="Emotional_Reg"
                            value={formData.Emotional_Reg}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="Not at all">Not at all</option>
                            <option value="Several days">Several days</option>
                            <option value="More than half the days">More than half the days</option>
                            <option value="Nearly every day">Nearly every day</option>
                        </select>
                    </div>

                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            Over the past two weeks, how often have you had trouble sleeping?
                        </label>
                        <select
                            className="form-control"
                            name="Physical_Stress"
                            value={formData.Physical_Stress}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="Not at all">Not at all</option>
                            <option value="Several days">Several days</option>
                            <option value="More than half the days">More than half the days</option>
                            <option value="Nearly every day">Nearly every day</option>
                        </select>
                    </div>

                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            How often do you think negatively about your abilities?
                        </label>
                        <select
                            className="form-control"
                            name="Cognitive_Stress"
                            value={formData.Cognitive_Stress}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="Never">Never</option>
                            <option value="Rarely">Rarely</option>
                            <option value="Sometimes">Sometimes</option>
                            <option value="Often">Often</option>
                            <option value="Always">Always</option>
                        </select>
                    </div>

                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            How often do you procrastinate due to stress?
                        </label>
                        <select
                            className="form-control"
                            name="Behavioral_Response"
                            value={formData.Behavioral_Response}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="Never">Never</option>
                            <option value="Rarely">Rarely</option>
                            <option value="Sometimes">Sometimes</option>
                            <option value="Often">Often</option>
                            <option value="Always">Always</option>
                        </select>
                    </div>

                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            How much does work contribute to your stress? (1-5)
                        </label>
                        <select
                            className="form-control"
                            name="Work_Stress"
                            value={formData.Work_Stress}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Level</option>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            How often do you have trouble concentrating?
                        </label>
                        <select
                            className="form-control"
                            name="Productivity"
                            value={formData.Productivity}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="Not at all">Not at all</option>
                            <option value="Several days">Several days</option>
                            <option value="More than half the days">More than half the days</option>
                            <option value="Nearly every day">Nearly every day</option>
                        </select>
                    </div>

                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            Free time for self-care (minutes)
                        </label>
                        <input
                            className="form-control"
                            type="number"
                            name="FreeTime"
                            value={formData.FreeTime}
                            onChange={handleInputChange}
                            placeholder="Enter minutes"
                            required
                        />
                    </div>

                    <div className="mental-modal-mb-3">
                        <label className="mental-modal-form-label">
                            Upload a photo for emotional analysis
                        </label>
                        <input
                            className="form-control"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                        {imagePreview && (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            </div>
                        )}
                    </div>

                    <div className="mental-modal-button-group">
                        <button
                            className="mental-modal-btn-primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                            className="mental-modal-close-btn"
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MentalRiskModal;