import React, { useState, useEffect } from 'react';
import { Flat } from '@alptugidin/react-circular-progress-bar';
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from '../../services/api';
import axios from 'axios';
import "./styles.css";
import NutritionRecommandationModal from '../../components/NutritionRecommandationModal';
import FeatureContributionsModal from '../../components/NutritionFeatureContributionsModal/NutritionFeatureContributionsModal';
import PhysicalRiskFeatureContributionsModal from '../../components/PhysicalRiskFeatureContributionsModal/PhysicalRiskFeatureContributionsModal';
import AddSuggestionModal from '../../components/AddSuggestionModal/AddSuggestionModal';
import ExerciseRecommendationsModal from '../../components/ExerciseRecommendationsModal/ExerciseRecommendationsModal';
import MentalRecommandationModal from "@/components/MentalRecommandationModal/MentalRecommandationModal";
import DiseaseSelectionModal from '../../components/DiseaseSelectionModal/DiseaseSelectionModal';

interface Disease {
    id: string;
    name: string;
}

// Function to format timestamp to a readable date
const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
};

export interface MentalRiskData {
    DL_Output: string;
    ML_Output: string;
    Scenario: string;
}

const RiskScores = () => {
    const [nutritionScore, setNutritionScore] = useState<number>(0);
    const [physicalScore, setPhysicalScore] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showNutritionModal, setShowNutritionModal] = useState(false);
    const [nutritionRecommendations, setNutritionRecommendations] = useState<any>(null);
    const [showFeatureContributions, setShowFeatureContributions] = useState(false);
    const [featureContributions, setFeatureContributions] = useState(null);
    const [showPhysicalFeatureContributions, setShowPhysicalFeatureContributions] = useState(false);
    const [physicalFeatureContributions, setPhysicalFeatureContributions] = useState(null);
    const [showAddSuggestionModal, setShowAddSuggestionModal] = useState(false);
    const [suggestionType, setSuggestionType] = useState<'nutrition' | 'physical' | 'mental'>('nutrition');
    const [showPreviousRecommendations, setShowPreviousRecommendations] = useState(false);
    const [previousRecommendations, setPreviousRecommendations] = useState<any>(null);
    const [nutritionSummary, setNutritionSummary] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [mentalRiskData, setMentalRiskData] = useState<MentalRiskData | null>(
        null
    );
    const [showMentalModal, setShowMentalModal] = useState(false);
    const [lastRecommendation, setLastRecommendation] = useState<any>(null);
    const [showDateMessage, setShowDateMessage] = useState(false);
    const [showPhysicalDateMessage, setShowPhysicalDateMessage] = useState(false);
    const [showMentalDateMessage, setShowMentalDateMessage] = useState(false);
    const [lastPhysicalRecommendation, setLastPhysicalRecommendation] = useState<any>(null);

    // Define the latestRecommendationDate variable
    const [showDiseaseModal, setShowDiseaseModal] = useState(false);
    const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);

    const handleDiseaseSubmit = (diseases: string[]) => {
        console.log("Diseases submitted:", diseases);
        setSelectedDiseases(diseases);
    };

    useEffect(() => {
        if (selectedDiseases.length > 0) {
            console.log("Selected diseases updated:", selectedDiseases);
            handleViewRecommendations();
        }
    }, [selectedDiseases]);

    const diseases: Disease[] = [
        { id: 'd1', name: 'Diabetes' },
        { id: 'd2', name: 'Obesity' },
        { id: 'd3', name: 'Hypertension' },
        { id: 'd4', name: 'Heart Disease' },
        { id: 'd5', name: 'Coronary Artery Disease' },
        { id: 'd6', name: 'Stroke' },
        { id: 'd7', name: 'Chronic Kidney Disease' },
        { id: 'd8', name: 'Non-Alcoholic Fatty Liver Disease' },
        { id: 'd9', name: 'Polycystic Ovary Syndrome (PCOS)' },
        { id: 'd10', name: 'Hyperlipidemia' },
        { id: 'd11', name: 'Insulin Resistance' },
        { id: 'd12', name: 'Metabolic Syndrome' },
        { id: 'd13', name: 'Sleep Apnea' },
        { id: 'd14', name: 'Gout' },
        { id: 'd15', name: 'Thyroid Disorders' },
        { id: 'd16', name: 'Pancreatitis' },
        { id: 'd17', name: 'Depression' },
        { id: 'd18', name: 'Anxiety' },
        { id: 'd19', name: 'Chronic Inflammation' },
        { id: 'd20', name: 'Hypoglycemia' },
        { id: 'd21', name: 'Peripheral Neuropathy' },
        { id: 'd22', name: 'Retinopathy' },
        { id: 'd23', name: 'Nephropathy' },
        { id: 'd24', name: 'Foot Ulcers' },
        { id: 'd25', name: 'Periodontal Disease' },
        { id: 'd26', name: 'Cognitive Decline' },
        { id: 'd27', name: 'Alzheimer’s Disease' },
        { id: 'd28', name: 'Osteoporosis' },
        { id: 'd29', name: 'Vitamin D Deficiency' },
        { id: 'd30', name: 'Insomnia' },
        { id: 'd31', name: 'Chronic Stress' },
        { id: 'd32', name: 'Erectile Dysfunction' },
        { id: 'd33', name: 'PCOS-related Infertility' },
        { id: 'd34', name: 'Gallbladder Disease' },
        { id: 'd35', name: 'Hemochromatosis' },
        { id: 'd36', name: 'Autonomic Neuropathy' },
        { id: 'd37', name: 'Gastroesophageal Reflux Disease (GERD)' },
        { id: 'd38', name: 'Fatigue Syndrome' },
        { id: 'd39', name: 'Glaucoma' },
        { id: 'd40', name: 'Macular Degeneration' },
        { id: 'd41', name: 'Chronic Migraines' },
        { id: 'd42', name: 'Chronic Fatigue Syndrome' },
        { id: 'd43', name: 'Increased Blood Clotting Risk' },
        { id: 'd44', name: 'Reactive Hypoglycemia' },
        { id: 'd45', name: 'Diabetic Dermopathy' },
        { id: 'd46', name: 'Acanthosis Nigricans' },
        { id: 'd47', name: 'Chronic Pain' },
        { id: 'd48', name: 'Skin Infections' },
        { id: 'd49', name: 'Bacterial Infections' },
        { id: 'd50', name: 'Urinary Tract Infections' },
        { id: 'd51', name: 'Yeast Infections' },
        { id: 'd52', name: 'Fungal Infections' },
        { id: 'd53', name: 'ADHD' },
        { id: 'd54', name: 'Liver Cirrhosis' },
        { id: 'd55', name: 'Insulinoma' },
        { id: 'd56', name: 'Cushing’s Syndrome' },
        { id: 'd57', name: 'Addison’s Disease' },
        { id: 'd58', name: 'Anemia' },
        { id: 'd59', name: 'Asthma' },
        { id: 'd60', name: 'COPD' },
        { id: 'd61', name: 'High Cholesterol' },
        { id: 'd62', name: 'IBS' },
        { id: 'd63', name: 'Lactose Intolerance' },
        { id: 'd64', name: 'Chronic Constipation' },
        { id: 'd65', name: 'Nut Allergy' },
        { id: 'd66', name: 'Shellfish Allergy' },
        { id: 'd67', name: 'Egg Allergy' },
        { id: 'd68', name: 'Soy Allergy' },
        { id: 'd69', name: 'Gluten Sensitivity' },
        { id: 'd70', name: 'Lactose Intolerance' },
        { id: 'd71', name: 'Celiac Disease' },
        { id: 'd72', name: 'Peanut Allergy' },
        { id: 'd73', name: 'Obesity' },
        { id: 'd74', name: 'Gout' },
        { id: 'd75', name: 'Hypertension' },
        { id: 'd76', name: 'Cardiovascular Disease' }
    ];
    // Function to get the color based on the risk level
    const getMentalRiskColor = (level: string | undefined) => {
        if (!level) return "#2196F3"; // Default blue

        const lowerLevel = level.toLowerCase();
        if (lowerLevel.includes("low")) return "#4CAF50"; // Green
        if (lowerLevel.includes("moderate")) return "#2196F3"; // Blue
        if (lowerLevel.includes("high")) return "#FFA500"; // Orange
        if (lowerLevel.includes("severe")) return "#f44336"; // Red
        return "#2196F3"; // Default blue
    };


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) return;

                const { email } = JSON.parse(userData);
                const response = await fetch(getDatabaseUrl(`/users?email=${email}`));
                const userResponseData = await response.json();

                if (userResponseData && userResponseData[0]?.nutritionAssessments?.length > 0) {
                    const latestAssessment = userResponseData[0].nutritionAssessments[userResponseData[0].nutritionAssessments.length - 1];
                    const score = latestAssessment.nutritionRiskPrediction[0];
                    setNutritionScore(Math.round(score));

                    // Set feature contributions if available
                    if (latestAssessment.feature_contributions) {
                        setFeatureContributions(latestAssessment.feature_contributions);
                    }
                }

                // Get the latest physical assessment
                if (userResponseData && userResponseData[0]?.physicalAssessments?.length > 0) {
                    const latestPhysicalAssessment = userResponseData[0].physicalAssessments[userResponseData[0].physicalAssessments.length - 1];
                    const physicalScore = latestPhysicalAssessment.physicalRiskPrediction[0];
                    setPhysicalScore(Math.round(physicalScore));

                    // Set physical feature contributions if available
                    if (latestPhysicalAssessment.feature_contributions) {
                        setPhysicalFeatureContributions(latestPhysicalAssessment.feature_contributions);
                    }
                }

                if (
                    userResponseData &&
                    userResponseData[0]?.mentalAssessments?.length > 0
                ) {
                    const latestMentalAssessment =
                        userResponseData[0].mentalAssessments[
                        userResponseData[0].mentalAssessments.length - 1
                        ];
                    setMentalRiskData(latestMentalAssessment.prediction);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            }
        };

        fetchUserData();

        // Define scenario here
        const scenario = mentalRiskData?.Scenario || "No assessment available";

        // Listen for nutrition assessment updates
        const handleNutritionUpdate = (event: CustomEvent) => {
            const { prediction, featureContributions } = event.detail;
            setNutritionScore(Math.round(prediction));
            setFeatureContributions(featureContributions);
        };

        // Listen for physical assessment updates
        const handlePhysicalUpdate = (event: CustomEvent) => {
            const { prediction, featureContributions } = event.detail;
            setPhysicalScore(Math.round(prediction));
            setPhysicalFeatureContributions(featureContributions);
        };

        window.addEventListener('nutritionAssessmentUpdated', handleNutritionUpdate as EventListener);
        window.addEventListener('physicalAssessmentUpdated', handlePhysicalUpdate as EventListener);

        return () => {
            window.removeEventListener('nutritionAssessmentUpdated', handleNutritionUpdate as EventListener);
            window.removeEventListener('physicalAssessmentUpdated', handlePhysicalUpdate as EventListener);
        };
    }, [mentalRiskData]); // Add mentalRiskData as a dependency

    useEffect(() => {
        const fetchLastRecommendation = async () => {
            try {
                const storedUser = localStorage.getItem('userData');
                if (storedUser) {
                    const { email } = JSON.parse(storedUser);
                    const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                    if (response.data && response.data.length > 0) {
                        const user = response.data[0];

                        // Get the last saved nutrition recommendation
                        const lastRec = user.nutritionRecommendations?.slice(-1)[0];

                        if (lastRec) {
                            setLastRecommendation(lastRec);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching last recommendation:', error);
            }
        };

        fetchLastRecommendation();
    }, []);

    useEffect(() => {
        const fetchLastPhysicalRecommendation = async () => {
            try {
                const storedUser = localStorage.getItem('userData');
                if (storedUser) {
                    const { email } = JSON.parse(storedUser);
                    const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                    if (response.data && response.data.length > 0) {
                        const user = response.data[0];
                        const lastPhysicalRec = user.physicalRecommendations?.slice(-1)[0];

                        if (lastPhysicalRec) {
                            setLastPhysicalRecommendation(lastPhysicalRec);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching last physical recommendation:', error);
            }
        };

        fetchLastPhysicalRecommendation();
    }, []);

    // Add this function to fetch feature contributions
    const fetchFeatureContributions = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    if (user.nutritionAssessments && user.nutritionAssessments.length > 0) {
                        const latestAssessment = user.nutritionAssessments[user.nutritionAssessments.length - 1];
                        if (latestAssessment.feature_contributions) {
                            setFeatureContributions(latestAssessment.feature_contributions);
                            setShowFeatureContributions(true);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching feature contributions:', error);
        }
    };

    // Add this function to fetch physical feature contributions
    const fetchPhysicalFeatureContributions = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    if (user.physicalAssessments && user.physicalAssessments.length > 0) {
                        const latestAssessment = user.physicalAssessments[user.physicalAssessments.length - 1];
                        if (latestAssessment.feature_contributions) {
                            setPhysicalFeatureContributions(latestAssessment.feature_contributions);
                            setShowPhysicalFeatureContributions(true);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching physical feature contributions:', error);
        }
    };

    const handleAddSuggestion = async (suggestionData: any) => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    const updatedUser = {
                        ...user,
                        suggestions: [
                            ...(user.suggestions || []),
                            {
                                goal: suggestionData.goal,
                                suggestions: suggestionData.suggestions,
                                date: new Date().toISOString() // Save timestamp
                            }
                        ]
                    };
                    await axios.put(`http://localhost:8000/users/${user.id}`, updatedUser);
                }
            }
        } catch (error) {
            console.error('Error adding suggestion:', error);
        }
    };

    // Add this function to fetch previous recommendations
    const fetchPreviousRecommendations = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await fetch(getDatabaseUrl(`/users?email=${email}`));
                const userData = await response.json();

                if (userData && userData.length > 0) {
                    const user = userData[0];
                    if (user.physical_activity_recommendations && user.physical_activity_recommendations.length > 0) {
                        // Filter out empty objects and get the latest recommendation
                        const validRecommendations = user.physical_activity_recommendations.filter(
                            (rec: any) => rec.recommendations && Object.keys(rec.recommendations).length > 0
                        );

                        if (validRecommendations.length > 0) {
                            const latestRecommendation = validRecommendations
                                .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

                            setPreviousRecommendations(latestRecommendation.recommendations);
                            setLastPhysicalRecommendation(latestRecommendation.timestamp); // Update the state
                            console.log("last recommendation date", lastPhysicalRecommendation);
                            setShowPreviousRecommendations(true);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching previous recommendations:', error);
        }
    };

    const handleViewRecommendations = async () => {
        setLoading(true); // Start loading
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    const latestNutritionAssessment = user.nutritionAssessments?.[user.nutritionAssessments.length - 1];
                    console.log("selected diseases", selectedDiseases);
                    if (latestNutritionAssessment) {
                        const requestData = {
                            age: parseInt(latestNutritionAssessment.formData.age),
                            gender: parseInt(latestNutritionAssessment.formData.gender),
                            bmi: calculateBMI(latestNutritionAssessment.formData.height, latestNutritionAssessment.formData.weight),
                            diabetes_risk: parseFloat(latestNutritionAssessment.formData.Diabetic_Risk),
                            nutrition_risk: parseFloat(latestNutritionAssessment.nutritionRiskPrediction[0]),
                            preferences: "Sri Lankan",
                            diseases: selectedDiseases // Ensure this is passed correctly
                        };

                        console.log("Request data:", requestData);

                        const recommendationResponse = await axios.post('http://127.0.0.1:5000/generate_meal_plan', requestData);
                        const recommendationData = recommendationResponse.data;
                        console.log(recommendationData);

                        if (recommendationData) {
                            // Define the type for recommendation data
                            interface RecommendationData {
                                day: string;
                                food_id: string;
                                food_item: string;
                                meal: string;
                                nutrients: {
                                    calories: number;
                                    carbs: number;
                                    fat: number;
                                    glycemic_index: number;
                                    protein: number;
                                };
                                portion_g: number;
                            }

                            // Update the formattedRecommendations logic
                            const formattedRecommendations = recommendationData.map((item: RecommendationData) => ({
                                day: item.day,
                                meals: {
                                    [item.meal]: [{
                                        food_id: item.food_id,
                                        food_item: item.food_item,
                                        portion_g: item.portion_g,
                                        nutrients: {
                                            calories: item.nutrients?.calories || 'N/A',
                                            carbs: item.nutrients?.carbs || 'N/A',
                                            fat: item.nutrients?.fat || 'N/A',
                                            protein: item.nutrients?.protein || 'N/A',
                                            glycemic_index: item.nutrients?.glycemic_index || 'N/A',
                                        }
                                    }]
                                }
                            }));

                            // Save the recommendation in db.json with timestamp
                            const updatedUser = {
                                ...user,
                                nutritionRecommendations: [...(user.nutritionRecommendations || []), {
                                    ...recommendationData,
                                    timestamp: new Date().toISOString()
                                }]
                            };
                            await axios.put(`http://localhost:8000/users/${user.id}`, updatedUser);

                            // Set the recommendation data to state
                            setNutritionRecommendations(formattedRecommendations);
                            setNutritionSummary(recommendationData.summary);
                            setShowNutritionModal(true);
                        } else {
                            console.error('No updated meal plan found in the response.');
                        }
                    } else {
                        console.error('No latest nutrition assessment found.');
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleViewPreviousRecommendations = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];

                    // Get the last saved nutrition recommendation
                    const lastRecommendation = user.nutritionRecommendations?.slice(-1)[0];

                    if (lastRecommendation) {
                        // Format the previous recommendations
                        const formattedRecommendations = Object.values(lastRecommendation).reduce((acc: any, item: any) => {
                            if (!acc[item.day]) {
                                acc[item.day] = { day: item.day, meals: {} };
                            }
                            if (!acc[item.day].meals[item.meal]) {
                                acc[item.day].meals[item.meal] = [];
                            }
                            acc[item.day].meals[item.meal].push({
                                food_id: item.food_id,
                                food_item: item.food_item,
                                portion_g: item.portion_g,
                                nutrients: {
                                    calories: item.nutrients?.calories || 'N/A',
                                    carbs: item.nutrients?.carbs || 'N/A',
                                    fat: item.nutrients?.fat || 'N/A',
                                    protein: item.nutrients?.protein || 'N/A',
                                    glycemic_index: item.nutrients?.glycemic_index || 'N/A',
                                }
                            });
                            return acc;
                        }, {});

                        // Convert the object to an array
                        const recommendationsArray = Object.values(formattedRecommendations);

                        // Set the recommendation data to state
                        setNutritionRecommendations(recommendationsArray);
                        setNutritionSummary(lastRecommendation.summary);
                        setShowNutritionModal(true);
                    } else {
                        alert("No previous recommendations found.");
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching previous recommendations:', error);
        }
    };

    // Helper function to calculate BMI
    const calculateBMI = (height: string, weight: string) => {
        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        return weightInKg / (heightInMeters * heightInMeters);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="risk-scores-container">
            <h1 className="risk-scores-title">
                Personal Diabetic Risk Scores
            </h1>

            <div className="risk-scores-grid">
                {/* Nutrition Risk Score Card */}
                <div className="risk-score-card">
                    <h2 className="risk-score-title nutrition">Nutrition Risk Score</h2>
                    <div style={{ position: 'relative' }}>
                        <Flat
                            progress={nutritionScore}
                            range={{ from: 0, to: 100 }}
                            sign={{ value: "%", position: "end" }}
                            showMiniCircle={false}
                            showValue={true}
                            sx={{
                                strokeColor: "#ff5722",
                                barWidth: 8,
                                bgStrokeColor: "#2d3748",
                                bgColor: { value: "#000000", transparency: "20" },
                                shape: "full",
                                strokeLinecap: "round",
                                valueSize: 18,
                                valueWeight: "bold",
                                valueColor: "#ff5722",
                                valueFamily: "Trebuchet MS",
                                textSize: 14,
                                textWeight: "bold",
                                textColor: "#ff5722",
                                textFamily: "Trebuchet MS",
                                loadingTime: 1000,
                                miniCircleColor: "#a78bfa",
                                miniCircleSize: 5,
                                valueAnimation: true,
                                intersectionEnabled: true,
                            }}
                        />

                    </div>
                    <button className="button-date" onClick={() => {
                        setShowDateMessage(prevState => !prevState); // Toggle visibility
                        if (!showDateMessage) {
                            setTimeout(() => setShowDateMessage(false), 2000); // Hide after 2 seconds if it was just shown
                        }
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar2-week" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                        </svg>
                    </button>
                    {showDateMessage && (
                        <div className="date-message">
                            Latest recommendation date: {formatDate(lastRecommendation?.timestamp)}
                        </div>
                    )}

                    {/*<button
                        className="recommendation-button nutrition"
                        onClick={fetchFeatureContributions}
                    >
                        Feature Contribution
                    </button>*/}

                    <button className="recommendation-button nutrition" onClick={() => setShowDiseaseModal(true)}>
                        View Recommendations
                    </button>



                    <button className="recommendation-button nutrition" onClick={handleViewPreviousRecommendations}>
                        Previous Recommendations
                    </button>
                </div>

                {/* Physical Activity Risk Score Card */}
                <div className="risk-score-card">
                    <h2 className="risk-score-title physical">Physical Activity Risk Score</h2>
                    <Flat
                        progress={physicalScore}
                        range={{ from: 0, to: 100 }}
                        sign={{ value: "%", position: "end" }}
                        showMiniCircle={false}
                        showValue={true}
                        sx={{
                            strokeColor: "#4CAF50",
                            barWidth: 8,
                            bgStrokeColor: "#2d3748",
                            bgColor: { value: "#000000", transparency: "20" },
                            shape: "full",
                            strokeLinecap: "round",
                            valueSize: 18,
                            valueWeight: "bold",
                            valueColor: "#4CAF50",
                            valueFamily: "Trebuchet MS",
                            textSize: 14,
                            textWeight: "bold",
                            textColor: "#4CAF50",
                            textFamily: "Trebuchet MS",
                            loadingTime: 1000,
                            miniCircleColor: "#a78bfa",
                            miniCircleSize: 5,
                            valueAnimation: true,
                            intersectionEnabled: true,
                        }}
                    />
                    <button className="button-date" onClick={() => {
                        setShowPhysicalDateMessage(prevState => !prevState); // Toggle visibility
                        if (!showPhysicalDateMessage) {
                            setTimeout(() => setShowPhysicalDateMessage(false), 2000); // Hide after 2 seconds if it was just shown
                        }
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar2-week" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                        </svg>                    </button>
                    {showPhysicalDateMessage && (
                        <div className="date-message">
                            Latest  recommendation date: {formatDate(lastPhysicalRecommendation)}
                        </div>
                    )}
                    <button className="recommendation-button physical" onClick={fetchPhysicalFeatureContributions}>
                        Feature Contribution
                    </button>
                    <button className="recommendation-button physical" onClick={() => {
                        setSuggestionType('physical');
                        setShowAddSuggestionModal(true);
                    }}>
                        View Recommendations
                    </button>
                    <button
                        className="recommendation-button physical"
                        onClick={fetchPreviousRecommendations}
                    >
                        Previous Recommendations
                    </button>
                </div>

                {/* Mental Health Risk Score Card */}
                <div className="risk-score-card">
                    <h2 className="risk-score-title mental">Mental Health Risk</h2>
                    <div className="mental-risk-display">
                        <div
                            className="mental-risk-circle"
                            style={{
                                border: `20px solid ${getMentalRiskColor(mentalRiskData?.ML_Output)}`,
                                color: getMentalRiskColor(mentalRiskData?.ML_Output),
                                backgroundColor: `${getMentalRiskColor(mentalRiskData?.ML_Output)}20`,
                            }}
                        >
                            <div className="mental-label">Stress Level</div>
                            <div className="mental-value">{mentalRiskData?.ML_Output || "Not Assessed"}</div>
                            <div className="mental-label">Mood</div>
                            <div className="mental-value">
                                {mentalRiskData?.DL_Output || "N/A"}
                            </div>
                        </div>
                    </div>
                    <button className="button-date" onClick={() => {
                        setShowMentalDateMessage(prevState => !prevState); // Toggle visibility
                        if (!showMentalDateMessage) {
                            setTimeout(() => setShowMentalDateMessage(false), 2000); // Hide after 2 seconds if it was just shown
                        }
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar2-week" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                        </svg>
                    </button>
                    {showMentalDateMessage && (
                        <div className="date-message">
                            Latest recommendation date: {formatDate(lastRecommendation?.timestamp)}
                        </div>
                    )}
                    <button
                        className="recommendation-button mental"
                        onClick={() => setShowMentalModal(true)}
                    >
                        View Recommendations
                    </button>
                </div>
            </div>
            <NutritionRecommandationModal
                isOpen={showNutritionModal}
                onClose={() => setShowNutritionModal(false)}
                recommendations={nutritionRecommendations}
                summary={nutritionSummary}
            />
            <FeatureContributionsModal
                isOpen={showFeatureContributions}
                onClose={() => setShowFeatureContributions(false)}
                contributions={featureContributions}
            />
            <PhysicalRiskFeatureContributionsModal
                isOpen={showPhysicalFeatureContributions}
                onClose={() => setShowPhysicalFeatureContributions(false)}
                contributions={physicalFeatureContributions}
            />
            <AddSuggestionModal
                isOpen={showAddSuggestionModal}
                onClose={() => setShowAddSuggestionModal(false)}
                onSubmit={handleAddSuggestion}
            />
            <MentalRecommandationModal
                show={showMentalModal}
                onClose={() => setShowMentalModal(false)}
                scenario={mentalRiskData?.Scenario || "No assessment available"} // Use scenario here
            />
            <DiseaseSelectionModal
                isOpen={showDiseaseModal}
                onClose={() => setShowDiseaseModal(false)}
                onSubmit={handleDiseaseSubmit}
            />
            {showPreviousRecommendations && previousRecommendations && (
                <ExerciseRecommendationsModal
                    isOpen={showPreviousRecommendations}
                    onClose={() => setShowPreviousRecommendations(false)}
                    recommendations={previousRecommendations}
                />
            )}
        </div>
    );
};

export default RiskScores;
