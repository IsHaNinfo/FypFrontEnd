import React, { useState, useEffect } from 'react';
import { Flat } from "@alptugidin/react-circular-progress-bar";
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from '../../services/api';
import axios from 'axios';
import "./styles.css";
import NutritionRecommandationModal from '../../components/NutritionRecommandationModal';

const RiskScores = () => {
    const [nutritionScore, setNutritionScore] = useState<number>(0);
    const [physicalScore, setPhysicalScore] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showNutritionModal, setShowNutritionModal] = useState(false);
    const [nutritionRecommendations, setNutritionRecommendations] = useState([]);

    const mockRecommendations = [

        {
            day: 'Monday',
            meals: {
                breakfast: [{ food: 'Oatmeal', grams: 50 }, { food: 'Banana', grams: 100 }],
                lunch: [{ food: 'Grilled Chicken', grams: 120 }, { food: 'Brown Rice', grams: 80 }],
                dinner: [{ food: 'Salmon', grams: 100 }, { food: 'Broccoli', grams: 70 }],
                snack: [{ food: 'Almonds', grams: 30 }]
            },
        },
        {
            day: 'Tuesday',
            meals: {
                breakfast: [{ food: 'Oatmeal', grams: 50 }, { food: 'Banana', grams: 100 }],
                lunch: [{ food: 'Grilled Chicken', grams: 120 }, { food: 'Brown Rice', grams: 80 }],
                dinner: [{ food: 'Salmon', grams: 100 }, { food: 'Broccoli', grams: 70 }],
                snack: [{ food: 'Almonds', grams: 30 }]
            }
        },
        // ... add 6 more days with similar structure ...
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) return;

                const { email } = JSON.parse(userData);
                const response = await fetch(getDatabaseUrl(`/users?email=${email}`));
                const userResponseData = await response.json();

                if (userResponseData && userResponseData[0]?.nutritionAssessments?.length > 0) {
                    // Get the latest nutrition assessment
                    const latestAssessment = userResponseData[0].nutritionAssessments[userResponseData[0].nutritionAssessments.length - 1];
                    const score = latestAssessment.nutritionRiskPrediction[0];
                    setNutritionScore(Math.round(score));
                }

                // Get the latest physical assessment
                if (userResponseData && userResponseData[0]?.physicalAssessments?.length > 0) {
                    const latestPhysicalAssessment = userResponseData[0].physicalAssessments[userResponseData[0].physicalAssessments.length - 1];
                    const physicalScore = latestPhysicalAssessment.physicalRiskPrediction[0];
                    setPhysicalScore(Math.round(physicalScore));
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            }
        };

        fetchUserData();

        // Add event listener for prediction updates
        const handlePredictionUpdate = () => {
            fetchUserData();
        };

        window.addEventListener('predictionUpdated', handlePredictionUpdate);
        return () => {
            window.removeEventListener('predictionUpdated', handlePredictionUpdate);
        };
    }, []);

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
                    <button className="recommendation-button nutrition" onClick={() => {
                        setNutritionRecommendations(mockRecommendations);
                        setShowNutritionModal(true);
                    }}>
                        View Recommendations
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
                    <button className="recommendation-button physical">
                        View Recommendations
                    </button>
                </div>

                {/* Mental Health Risk Score Card */}
                <div className="risk-score-card">
                    <h2 className="risk-score-title mental">Mental Health Risk Score</h2>
                    <Flat
                        progress={85}
                        range={{ from: 0, to: 100 }}
                        sign={{ value: "%", position: "end" }}
                        showMiniCircle={false}
                        showValue={true}
                        sx={{
                            strokeColor: "#2196F3",
                            barWidth: 8,
                            bgStrokeColor: "#2d3748",
                            bgColor: { value: "#000000", transparency: "20" },
                            shape: "full",
                            strokeLinecap: "round",
                            valueSize: 18,
                            valueWeight: "bold",
                            valueColor: "#2196F3",
                            valueFamily: "Trebuchet MS",
                            textSize: 14,
                            textWeight: "bold",
                            textColor: "#2196F3",
                            textFamily: "Trebuchet MS",
                            loadingTime: 1000,
                            miniCircleColor: "#a78bfa",
                            miniCircleSize: 5,
                            valueAnimation: true,
                            intersectionEnabled: true,
                        }}
                    />
                    <button className="recommendation-button mental">
                        View Recommendations
                    </button>
                </div>
            </div>
            <NutritionRecommandationModal
                isOpen={showNutritionModal}
                onClose={() => setShowNutritionModal(false)}
                recommendations={nutritionRecommendations}
            />
        </div>
    );
};

export default RiskScores;
