import React from "react";
import "./diabeticriskmodal.css";

interface CurrentDiabeticStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessmentData: any;
}

const CurrentDiabeticStatusModal: React.FC<CurrentDiabeticStatusModalProps> = ({ isOpen, onClose, assessmentData }) => {
    if (!isOpen || !assessmentData) return null;

    const { formData, prediction, timestamp } = assessmentData;

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="suggestion-modal-overlay">
            <div className="suggestion-modal-content">
                <button className="suggestion-modal-close-icon" onClick={onClose}>&times;</button>
                <h2 className="suggestion-modal-header">Current Diabetic Status</h2>

                <div className="assessment-timestamp">
                    Last Updated: {formatDate(timestamp)}
                </div>

                <div className="assessment-grid">
                    <div className="assessment-section">
                        <h3>Basic Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span>Age:</span>
                                <span>{formData.age} years</span>
                                <div className="info-description">Your current age</div>
                            </div>
                            <div className="info-item">
                                <span>Gender:</span>
                                <span>{formData.gender === "1.0" ? "Male" : "Female"}</span>
                            </div>
                            <div className="info-item">
                                <span>Height:</span>
                                <span>{formData.height} cm</span>
                            </div>
                            <div className="info-item">
                                <span>Weight:</span>
                                <span>{formData.weight} kg</span>
                            </div>
                        </div>
                    </div>

                    <div className="assessment-section">
                        <h3>Health Indicators</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span>Waist Circumference:</span>
                                <span>{formData.Waist_Circumference} inches</span>
                                <div className="info-description">Measurement around your waist</div>
                            </div>
                            <div className="info-item">
                                <span>Diet/Food Habits:</span>
                                <span>{formData.Diet_Food_Habits} meals/day</span>
                                <div className="info-description">Number of meals consumed daily</div>
                            </div>
                            <div className="info-item">
                                <span>Family History:</span>
                                <span>{formData.Family_History}</span>
                                <div className="info-description">History of diabetes in family</div>
                            </div>
                        </div>
                    </div>

                    <div className="assessment-section">
                        <h3>Medical Indicators</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span>Blood Pressure:</span>
                                <span>{formData.Blood_Pressure}</span>
                                <div className="info-description">Current blood pressure status</div>
                            </div>
                            <div className="info-item">
                                <span>Cholesterol Levels:</span>
                                <span>{formData.Cholesterol_Lipid_Levels}</span>
                                <div className="info-description">Current cholesterol status</div>
                            </div>
                        </div>
                    </div>

                    <div className="assessment-section">
                        <h3>Symptoms</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span>Thirst:</span>
                                <span>{formData.Thirst}</span>
                                <div className="info-description">Frequency of excessive thirst</div>
                            </div>
                            <div className="info-item">
                                <span>Fatigue:</span>
                                <span>{formData.Fatigue}</span>
                                <div className="info-description">Level of tiredness</div>
                            </div>
                            <div className="info-item">
                                <span>Urination:</span>
                                <span>{formData.Urination}</span>
                                <div className="info-description">Frequency of urination</div>
                            </div>
                            <div className="info-item">
                                <span>Vision Changes:</span>
                                <span>{formData.Vision_Changes}</span>
                                <div className="info-description">Changes in vision clarity</div>
                            </div>
                        </div>
                    </div>

                    <div className="assessment-section">
                        <h3>Risk Assessment</h3>
                        <div className="info-grid">
                            <div className="info-item highlight">
                                <span>Diabetic Risk:</span>
                                <span>{typeof prediction === 'number' ? `${(prediction * 100).toFixed(2)}%` : prediction}</span>
                                <div className="info-description">Overall risk of developing diabetes</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="suggestion-modal-btn-primary" onClick={onClose}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CurrentDiabeticStatusModal; 