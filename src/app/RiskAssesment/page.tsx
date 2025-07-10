"use client";
import React, { useState, useEffect } from "react";
import { Flat } from "@alptugidin/react-circular-progress-bar";
import "./styles.css"; // Import the external CSS file
import axios from "axios";
import NutritionRiskModal from '../../components/NutritionRiskModal/NutritionRiskModal';
import PhysicalActivityRiskModal from '../../components/PhysicalActivityRiskModal/PhysicalRiskModal';
import MentalRiskModal from "@/components/MentalRiskModal/MentalRiskModal";
import RiskValidationModal from '../../components/RiskValidationModal/RiskValidationModal';
import CurrentDiabeticStatusModal from '../../components/DiabeticRiskModal/CurrentDiabeticStatusModal';

const RiskAssesment = () => {
    const [prediction, setPrediction] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [showNutritionModal, setShowNutritionModal] = useState(false);
    const [showPhysicalModal, setShowPhysicalModal] = useState(false);
    const [showMentalModal, setShowMentalModal] = useState(false);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationData, setValidationData] = useState<any>(null);
    const [showCurrentStatusModal, setShowCurrentStatusModal] = useState(false);
    const [currentAssessment, setCurrentAssessment] = useState<any>(null);

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

                        // Set validation data if available
                        if (latestAssessment.validationData) {
                            setValidationData(latestAssessment.validationData);
                        }
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

        const handleDiabeticAssessmentUpdate = (event: CustomEvent) => {
            const { prediction, validationData } = event.detail;
            setPrediction(prediction);
            setValidationData(validationData);
        };

        window.addEventListener('predictionUpdated', handlePredictionUpdate);
        window.addEventListener('diabeticAssessmentUpdated', handleDiabeticAssessmentUpdate as EventListener);

        return () => {
            window.removeEventListener('predictionUpdated', handlePredictionUpdate);
            window.removeEventListener('diabeticAssessmentUpdated', handleDiabeticAssessmentUpdate as EventListener);
        };
    }, []);

    const handleRiskValidation = () => {
        if (validationData) {
            setShowValidationModal(true);
        } else {
            alert("No validation data available. Please complete a diabetic assessment first.");
        }
    };

    const handleShowCurrentStatus = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    if (user.diabeticAssessments && user.diabeticAssessments.length > 0) {
                        const latestAssessment = user.diabeticAssessments[user.diabeticAssessments.length - 1];
                        setCurrentAssessment(latestAssessment);
                        setShowCurrentStatusModal(true);
                        return;
                    }
                }
            }
            alert('No diabetic assessment found. Please complete an assessment first.');
        } catch (error) {
            alert('Error fetching current diabetic status.');
        }
    };

    const percentage = Math.round(prediction * 100);

    return (
        <div className="risk-assessment-container">
            {/* Left Side: Diagnostic Information */}
            <div className="diagnostic-info">
                <div className="diagnostic-card">
                    <h2 className="diagnostic-percentage">98%</h2>
                    <p className="diagnostic-text">Diagnostic Accuracy</p>
                </div>
                <div className="diagnostic-card">
                    <h2 className="diagnostic-percentage">2 Minute</h2>
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
                <div className="risk-buttons-container">
                    <h3 className="risk-buttons-title">Select a Risk Category</h3>
                    <div className="risk-buttons">
                        <button
                            className="risk-button nutrition-risk px-4 py-2 rounded-md"
                            onClick={() => setShowNutritionModal(true)}
                        >
                            Nutrition Risk
                        </button>
                        <button
                            className="risk-button physical-activity-risk px-4 py-2 rounded-md"
                            onClick={() => setShowPhysicalModal(true)}
                        >
                            Physical Activity Risk
                        </button>
                        <button
                            className="risk-button mental-risk px-4 py-2 rounded-md"
                            onClick={() => setShowMentalModal(true)}
                        >
                            Mental Risk
                        </button>
                    </div>
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
                        barWidth: 8, // Increase bar width
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
                {/* Description */}
                <div className="mb-2">
                    <p className="risk-description text-gray-700 text-center mb-4">
                        Your current diabetic risk score is calculated based on your health data.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <div className="flex justify-center mt-4">
                            <button
                                className="risk-validation-btn flex items-center gap-2 px-6 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300 text-lg"
                                onClick={handleRiskValidation}
                            >
                                Risk Validation
                            </button>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                className="risk-validation-btn flex items-center gap-2 px-6 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300 text-lg"
                                onClick={handleShowCurrentStatus}
                            >
                                Current Diabetic Status
                            </button>
                        </div>
                    </div>
                </div>

                {/* Buttons */}

            </div>

            <NutritionRiskModal
                isOpen={showNutritionModal}
                onClose={() => setShowNutritionModal(false)}
            />

            <PhysicalActivityRiskModal
                isOpen={showPhysicalModal}
                onClose={() => setShowPhysicalModal(false)}
            />

             <MentalRiskModal
                isOpen={showMentalModal}
                onClose={() => setShowMentalModal(false)}
            />
        </div>
    );
};

export default RiskAssesment;