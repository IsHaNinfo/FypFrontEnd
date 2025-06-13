"use client";
import React, { useState, useEffect } from "react";
import { Flat } from "@alptugidin/react-circular-progress-bar";
import "./styles.css"; // Import the external CSS file
import axios from "axios";
import NutritionRiskModal from '../../components/NutritionRiskModal/NutritionRiskModal';
import PhysicalActivityRiskModal from '../../components/PhysicalActivityRiskModal/PhysicalRiskModal';

const RiskAssesment = () => {
    const [prediction, setPrediction] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [showNutritionModal, setShowNutritionModal] = useState(false);
    const [showPhysicalModal, setShowPhysicalModal] = useState(false);
    const [showMentalModal, setShowMentalModal] = useState(false);

    const fetchUserPrediction = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    if (user.diabeticAssessments && user.diabeticAssessments.length > 0) {
                        // Get the latest prediction
                        const latestAssessment = user.diabeticAssessments[user.diabeticAssessments.length - 1];
                        setPrediction(latestAssessment.prediction);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching prediction:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPrediction();
    }, []);

    // Add event listener for prediction updates
    useEffect(() => {
        const handlePredictionUpdate = () => {
            fetchUserPrediction();
        };

        window.addEventListener('predictionUpdated', handlePredictionUpdate);
        return () => {
            window.removeEventListener('predictionUpdated', handlePredictionUpdate);
        };
    }, []);

    const percentage = Math.round(prediction);

    return (
        <div className="risk-assessment-container">
            {/* Left Side: Diagnostic Information */}
            <div className="diagnostic-info">
                <div className="diagnostic-card">
                    <h2 className="diagnostic-percentage">98%</h2>
                    <p className="diagnostic-text">Diagnostic Accuracy</p>
                </div>
                <div className="diagnostic-card">
                    <h2 className="diagnostic-percentage">5 Minute</h2>
                    <p className="diagnostic-text">To Get a Result</p>
                </div>
                <div className="diagnostic-card image-card">
                    <h2 className="diagnostic-percentage">98%</h2>
                    <p className="diagnostic-text">Uniqueness of Recommendations</p>
                </div>
                <div className="diagnostic-card ">
                    <h2 className="diagnostic-percentage">90%</h2>
                    <p className="diagnostic-text">Type 2 Diabetes Cases</p>
                </div>
                <div className="diagnostic-card ">
                    <h2 className="diagnostic-percentage">18.3%</h2>
                    <p className="diagnostic-text">
                        Adults in Sri Lanka with Diabetes
                    </p>
                </div>
                <div className="diagnostic-card">
                    <h2 className="diagnostic-percentage">40–50%</h2>
                    <p className="diagnostic-text">Undiagnosed Diabetic Cases</p>
                </div>
            </div>


            {/* Right Side: Diabetic Risk Assessment */}
            <div className="risk-assessment-content">
                {/* Title */}
                <h2 className="risk-title">Diabetic Risk Score</h2>
                {/* Circular Progress Bar */}
                <Flat
                    progress={percentage}
                    range={{ from: 0, to: 100 }}
                    sign={{ value: "%", position: "end" }}
                    showMiniCircle={false}
                    showValue={true}
                    sx={{
                        strokeColor: "#ff5722", // Purple progress bar color
                        barWidth: 10, // Increase bar width
                        bgStrokeColor: "#2d3748", // Dark grey background circle
                        bgColor: { value: "#000000", transparency: "20" },
                        shape: "full",
                        strokeLinecap: "round",
                        valueSize: 20, // Increase value size
                        valueWeight: "bold",
                        valueColor: "#ff5722", // White value color
                        valueFamily: "Trebuchet MS",
                        textSize: 16,
                        textWeight: "bold",
                        textColor: "#ff5722", // White text color
                        textFamily: "Trebuchet MS",
                        loadingTime: 1000,
                        miniCircleColor: "#a78bfa",
                        miniCircleSize: 5,
                        valueAnimation: true,
                        intersectionEnabled: true,
                    }}

                />
                {/* Description */}
                <p className="risk-description">
                    Your current diabetic risk score is calculated based on your health data.
                </p>

                {/* Buttons */}
                <div className="risk-buttons-container">
                    <h3 className="risk-buttons-title">Select a Risk Category</h3>
                    <div className="risk-buttons">
                        <button
                            className="risk-button nutrition-risk"
                            onClick={() => setShowNutritionModal(true)}
                        >
                            Nutrition Risk
                        </button>
                        
                        <button
                            className="risk-button physical-activity-risk"
                            onClick={() => setShowPhysicalModal(true)}
                        >
                            Physical Activity Risk
                        </button>
                        <button
                            className="risk-button mental-risk"
                            onClick={() => setShowMentalModal(true)}
                        >
                            Mental Risk
                        </button>
                    </div>
                </div>
            </div>

            <NutritionRiskModal
                isOpen={showNutritionModal}
                onClose={() => setShowNutritionModal(false)}
            />

            <PhysicalActivityRiskModal
                isOpen={showPhysicalModal}
                onClose={() => setShowPhysicalModal(false)}
            />

            {showMentalModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Mental Risk Assessment</h2>
                        <p>This feature is coming soon!</p>
                        <button onClick={() => setShowMentalModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskAssesment;