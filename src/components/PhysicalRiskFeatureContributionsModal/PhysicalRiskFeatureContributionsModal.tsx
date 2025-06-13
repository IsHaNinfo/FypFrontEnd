import React from 'react';
import './PhysicalRiskFeatureContributions.css';

interface PhysicalFeatureContributionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    contributions: {
        Age: number;
        BMI: number;
        EnergyLevels: number;
        Physical_Activity: number;
        Sitting_Time: number;
        Cardiovascular_Health: number;
        Muscle_Strength: number;
        Flexibility: number;
        Balance: number;
        Thirsty: number;
        Pain_or_Discomfort: number;
        Available_Time: number;
        DiabetesRisk: number;
        Gender: number;
        Height: number;
        Weight: number;
    } | null;
}

const PhysicalRiskFeatureContributionsModal: React.FC<PhysicalFeatureContributionsModalProps> = ({ isOpen, onClose, contributions }) => {
    if (!isOpen || !contributions) return null;

    // Calculate absolute values for better visualization
    const maxContribution = Math.max(...Object.values(contributions).map(Math.abs));
    const normalizedContributions = Object.entries(contributions).reduce((acc, [key, value]) => {
        acc[key] = (Math.abs(value) / maxContribution) * 100;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="physical-feature-modal-overlay">
            <div className="physical-feature-modal-content">
                <button className="physical-feature-modal-close-icon" onClick={onClose} type="button">
                    &times;
                </button>
                <div className='physical-feature-modal-header'>
                    <h2>Physical Risk Feature Contributions</h2>
                </div>
                <div className="physical-feature-modal-contributions">
                    <div className="contributions-grid">
                        {Object.entries(contributions).map(([feature, value]) => (
                            <div key={feature} className="contribution-item">
                                <div className="feature-label">
                                    <span>{feature.replace(/_/g, ' ')}</span>
                                    <span>{value.toFixed(2)}%</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${normalizedContributions[feature]}%`,
                                            backgroundColor: value >= 0 ? '#4CAF50' : '#f44336'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhysicalRiskFeatureContributionsModal; 