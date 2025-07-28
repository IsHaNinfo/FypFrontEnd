
import React from 'react';
import './PhysicalStatusModal.css';

interface PhysicalStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        physicalAssessments?: Array<{
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
            physicalRiskPrediction: number[];
            timestamp: string;
        }>;
    };
}

const PhysicalStatusModal: React.FC<PhysicalStatusModalProps> = ({ isOpen, onClose, userData }) => {
    if (!isOpen) return null;

    const latestAssessment = userData.physicalAssessments?.[userData.physicalAssessments.length - 1];s

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActivityLevel = (value: string) => {
        return value ? `Level ${value} out of 5` : value;
    };

    const getEnergyLevel = (value: string) => {
        return value ? `Level ${value} out of 10` : value;
    };

    const getWaterIntake = (value: string) => {
        return value ? `Level ${value} out of 10` : value;
    };

    return (
        <div className="suggestion-modal-overlay">
            <div className="suggestion-modal-content">
                <button className="suggestion-modal-close-icon" onClick={onClose}>&times;</button>
                <h2 className="suggestion-modal-header">Latest Physical Assessment Results</h2>

                {latestAssessment ? (
                    <>
                        <div className="assessment-timestamp">
                            Last Updated: {formatDate(latestAssessment.timestamp)}
                        </div>

                        <div className="assessment-grid">
                            <div className="assessment-section">
                                <h3>Activity Levels</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span>Energy Levels:</span>
                                        <span>{getEnergyLevel(latestAssessment.formData.EnergyLevels)}</span>
                                        <div className="info-description">Level of tiredness or energy lack after mild activity</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Physical Activity:</span>
                                        <span>{getActivityLevel(latestAssessment.formData.PhysicalActivity)}</span>
                                        <div className="info-description">Frequency of exercise or movement during the day</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Sitting Time:</span>
                                        <span>{latestAssessment.formData.SittingTime}</span>
                                        <div className="info-description">Whether most time is spent sitting</div>
                                    </div>
                                </div>
                            </div>

                            <div className="assessment-section">
                                <h3>Physical Condition</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span>Cardiovascular Health:</span>
                                        <span>{latestAssessment.formData.CardiovascularHealth}</span>
                                        <div className="info-description">Breathlessness after climbing stairs</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Muscle Strength:</span>
                                        <span>{latestAssessment.formData.MuscleStrength}</span>
                                        <div className="info-description">Ability to hold or lift heavy objects</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Flexibility:</span>
                                        <span>{latestAssessment.formData.Flexibility}</span>
                                        <div className="info-description">Ability to touch toes during sit-and-reach test</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Balance:</span>
                                        <span>{latestAssessment.formData.Balance}</span>
                                        <div className="info-description">Ability to balance on one leg for more than 5 seconds</div>
                                    </div>
                                </div>
                            </div>

                            <div className="assessment-section">
                                <h3>Health Indicators</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span>Water Intake:</span>
                                        <span>{getWaterIntake(latestAssessment.formData.Thirsty)}</span>
                                        <div className="info-description">Daily water consumption level</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Pain/Discomfort:</span>
                                        <span>{latestAssessment.formData.PainOrDiscomfort}</span>
                                        <div className="info-description">Pain in joints or muscles during movement</div>
                                    </div>
                                    <div className="info-item">
                                        <span>Office Hours:</span>
                                        <span>{latestAssessment.formData.AvailableTime} hours</span>
                                        <div className="info-description">Typical daily working hours in office</div>
                                    </div>
                                    <div className="info-item highlight">
                                        <span>Physical Risk Score:</span>
                                        <span>{Math.round(latestAssessment.physicalRiskPrediction[0])}%</span>
                                        <div className="info-description">Overall physical activity risk assessment</div>
                                    </div>
                                    <div className="info-item highlight">
                                        <span>Diabetic Risk:</span>
                                        <span>{Number(latestAssessment.formData.Diabetic_Risk).toFixed(2)}%</span>
                                        <div className="info-description">Risk level for developing diabetes</div>
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
                        <p>No physical assessment data available. Please complete an assessment first.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhysicalStatusModal;

