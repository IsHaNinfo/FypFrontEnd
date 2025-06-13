import React from 'react';
import './NutritionFeatureContributions.css';

interface FeatureContributionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    contributions: {
        Age: number;
        BMI: number;
        Caloric_Balance: number;
        Carbohydrate_Consumption: number;
        DiabetesRisk: number;
        Fat_Intake: number;
        Gender: number;
        Height: number;
        Portion_Control: number;
        Protein_Intake: number;
        Regularity_of_Meals: number;
        Sugar_Consumption: number;
        Weight: number;
    } | null;
}

const FeatureContributionsModal: React.FC<FeatureContributionsModalProps> = ({ isOpen, onClose, contributions }) => {
    if (!isOpen || !contributions) return null;

    // Calculate absolute values for better visualization
    const maxContribution = Math.max(...Object.values(contributions).map(Math.abs));
    const normalizedContributions = Object.entries(contributions).reduce((acc, [key, value]) => {
        acc[key] = (Math.abs(value) / maxContribution) * 100;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="nutri-feature-modal-overlay">
            <div className="nutri-feature-modal-content">
                <button className="nutri-feature-modal-close-icon" onClick={onClose} type="button">
                    &times;
                </button>
                <div className='nutri-feature-modal-header'>
                    <h2>Nutrition Risk Feature Contributions</h2>
                </div>
                <div className="nutri-feature-modal-contributions">
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

export default FeatureContributionsModal;