// src/components/CurrentStatusModal/CurrentStatusModal.tsx

import React from 'react';
import './CurrentStatusModal.css';

interface CurrentStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        nutritionAssessments?: Array<{
            formData: {
                age: string;
                gender: string;
                height: string;
                weight: string;
                mealsPerDay: string;
                waterIntake: string;
                foodAllergies: string;
                dietaryRestrictions: string;
                sugarIntake: string;
                saltIntake: string;
                processedFoodConsumption: string;
                fruitVegetableIntake: string;
                Diabetic_Risk: string;
            };
            nutritionRiskPrediction: number[];
            timestamp: string;
        }>;
    };
}

const CurrentStatusModal: React.FC<CurrentStatusModalProps> = ({ isOpen, onClose, userData }) => {
    if (!isOpen) return null;

    const latestAssessment = userData.nutritionAssessments?.[userData.nutritionAssessments.length - 1];

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateBMI = (height: string, weight: string) => {
        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    };

    return (
        <div className="suggestion-modal-overlay">
            <div className="suggestion-modal-content">
                <button className="suggestion-modal-close-icon" onClick={onClose}>&times;</button>
                <h2 className="suggestion-modal-header">Latest Assessment Results</h2>

                {latestAssessment ? (
                    <>
                        <div className="assessment-timestamp">
                            Last Updated: {formatDate(latestAssessment.timestamp)}
                        </div>

                        <div className="assessment-grid">
                            <div className="assessment-section">
                                <h3>Basic Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span>Age:</span>
                                        <span>{latestAssessment.formData.age} years</span>
                                    </div>
                                    <div className="info-item">
                                        <span>Gender:</span>
                                        <span>{latestAssessment.formData.gender === "1" ? "Male" : "Female"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span>Height:</span>
                                        <span>{latestAssessment.formData.height} cm</span>
                                    </div>
                                    <div className="info-item">
                                        <span>Weight:</span>
                                        <span>{latestAssessment.formData.weight} kg</span>
                                    </div>
                                    <div className="info-item">
                                        <span>BMI:</span>
                                        <span>{calculateBMI(latestAssessment.formData.height, latestAssessment.formData.weight)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="assessment-section">
                                <h3>Dietary Habits</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span>Meals per Day:</span>
                                        <span>{latestAssessment.formData.mealsPerDay}</span>
                                    </div>
                                    <div className="info-item">
                                        <span>Water Intake:</span>
                                        <span>{latestAssessment.formData.waterIntake} glasses</span>
                                    </div>
                                    <div className="info-item">
                                        <span>Sugar Intake:</span>
                                        <span>{latestAssessment.formData.sugarIntake}</span>
                                    </div>
                                    <div className="info-item">
                                        <span>Salt Intake:</span>
                                        <span>{latestAssessment.formData.saltIntake}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="assessment-section">
                                <h3>Risk Assessment</h3>
                                <div className="info-grid">
                                    <div className="info-item highlight">
                                        <span>Diabetic Risk:</span>
                                        <span>{latestAssessment.formData.Diabetic_Risk}%</span>
                                    </div>
                                    <div className="info-item highlight">
                                        <span>Nutrition Risk:</span>
                                        <span>{Math.round(latestAssessment.nutritionRiskPrediction[0])}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="suggestion-modal-btn-primary" onClick={onClose}>
                                Continue
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-assessment">
                        <p>No assessment data available. Please complete an assessment first.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentStatusModal;
