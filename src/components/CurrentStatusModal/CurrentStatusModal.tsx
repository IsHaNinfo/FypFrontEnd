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
                Carbohydrate_Consumption: string;
                Protein_Intake: string;
                Fat_Intake: string;
                Regularity_of_Meals: string;
                Portion_Control: string;
                Caloric_Balance: string;
                Sugar_Consumption: string;
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

    const getPortionSize = (value: string) => {
        const sizes = {
            "1.0": "Small (1/2 plate or 1 cup)",
            "2.0": "Small-Medium (3/4 plate or 1.5 cups)",
            "3.0": "Medium (1 plate or 2 cups)",
            "4.0": "Medium-Large (1.5 plates or 3 cups)",
            "5.0": "Large (2 plates or 4 cups)"
        };
        return sizes[value] || value;
    };

    return (
        <div className="suggestion-modal-overlay">
            <div className="suggestion-modal-content">
                <button className="suggestion-modal-close-icon" onClick={onClose}>&times;</button>
                <h2 className="suggestion-modal-header">Latest Nutritional Assessment Results</h2>

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
                                        <span>Carbohydrate Consumption:</span>
                                        <span>{`${latestAssessment.formData.Carbohydrate_Consumption} servings/day`}</span>
                                        <div className="info-description">Daily servings of rice, bread, or pasta</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Protein Intake:</span>
                                        <span>{latestAssessment.formData.Protein_Intake}</span>
                                        <div className="info-description">Regular consumption of eggs, chicken, lentils</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Fat Consumption:</span>
                                        <span>{latestAssessment.formData.Fat_Intake}</span>
                                        <div className="info-description">Type of fats most frequently consumed</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Meal Regularity:</span>
                                        <span>{latestAssessment.formData.Regularity_of_Meals}</span>
                                        <div className="info-description">Whether meals are skipped during the day</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Portion Size:</span>
                                        <span>{getPortionSize(latestAssessment.formData.Portion_Control)}</span>
                                        <div className="info-description">Average portion size per meal</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Daily Calories:</span>
                                        <span>{`${latestAssessment.formData.Caloric_Balance} calories`}</span>
                                        <div className="info-description">Estimated daily calorie intake</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Sugar Consumption:</span>
                                        <span>{`${latestAssessment.formData.Sugar_Consumption} items/day`}</span>
                                        <div className="info-description">Daily sugary snacks or drinks consumed</div>
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
