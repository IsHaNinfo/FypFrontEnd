import React from 'react';
import './RiskValidationModal.css';

interface ValidationData {
    comparison: {
        models_agree: boolean;
        prediction_difference: number;
        similar_cases: {
            average_prediction: number;
            count: number;
        };
    };
    predictions: {
        pima_model: {
            percentage: number;
            probability: number;
            risk_level: string;
        };
        your_model: {
            percentage: number;
            probability: number;
            risk_level: string;
        };
    };
    summary: {
        agreement_status: string;
        benchmark_risk: string;
        confidence: string;
        primary_risk: string;
    };
    validation_metrics: {
        brier_score: number;
        roc_auc: number;
    };
}

interface RiskValidationModalProps {
    isOpen: boolean;
    onClose: () => void;
    validationData: ValidationData;
}

const RiskValidationModal: React.FC<RiskValidationModalProps> = ({
    isOpen,
    onClose,
    validationData
}) => {
    if (!isOpen) return null;

    const getRiskLevelColor = (riskLevel: string) => {
        if (riskLevel.includes('Low')) return '#4CAF50';
        if (riskLevel.includes('Moderate')) return '#FF9800';
        if (riskLevel.includes('High')) return '#F44336';
        return '#fff';
    };

    const getAgreementColor = (agree: boolean) => {
        return agree ? '#4CAF50' : '#FF9800';
    };

    return (
        <div className="validation-modal-overlay">
            <div className="validation-modal-content">
                <button className="validation-modal-close" onClick={onClose}>&times;</button>

                <div className="validation-modal-header">
                    <h2>Risk Validation Results</h2>
                </div>

                <div className="validation-modal-body">
                    {/* Summary Section */}
                    <div className="validation-section">
                        <h3 className="section-title">Summary</h3>
                        <div className="summary-grid">
                            <div className="summary-item">
                                <span className="summary-label">Agreement Status:</span>
                                <span className="summary-value" style={{ color: getAgreementColor(validationData.comparison.models_agree) }}>
                                    {validationData.summary.agreement_status}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Primary Risk:</span>
                                <span className="summary-value" style={{ color: getRiskLevelColor(validationData.predictions.your_model.risk_level) }}>
                                    {validationData.summary.primary_risk}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Benchmark Risk:</span>
                                <span className="summary-value" style={{ color: getRiskLevelColor(validationData.predictions.pima_model.risk_level) }}>
                                    {validationData.summary.benchmark_risk}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Confidence:</span>
                                <span className="summary-value">{validationData.summary.confidence}</span>
                            </div>
                        </div>
                    </div>

                    {/* Model Predictions Section */}
                    <div className="validation-section">
                        <h3 className="section-title">Model Predictions</h3>
                        <div className="predictions-grid">
                            <div className="prediction-card">
                                <h4 className="prediction-title">Your Model</h4>
                                <div className="prediction-details">
                                    <div className="prediction-item">
                                        <span className="prediction-label">Risk Level:</span>
                                        <span className="prediction-value" style={{ color: getRiskLevelColor(validationData.predictions.your_model.risk_level) }}>
                                            {validationData.predictions.your_model.risk_level}
                                        </span>
                                    </div>
                                    <div className="prediction-item">
                                        <span className="prediction-label">Percentage:</span>
                                        <span className="prediction-value">{validationData.predictions.your_model.percentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="prediction-item">
                                        <span className="prediction-label">Probability:</span>
                                        <span className="prediction-value">{(validationData.predictions.your_model.probability * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="prediction-card">
                                <h4 className="prediction-title">PIMA Model</h4>
                                <div className="prediction-details">
                                    <div className="prediction-item">
                                        <span className="prediction-label">Risk Level:</span>
                                        <span className="prediction-value" style={{ color: getRiskLevelColor(validationData.predictions.pima_model.risk_level) }}>
                                            {validationData.predictions.pima_model.risk_level}
                                        </span>
                                    </div>
                                    <div className="prediction-item">
                                        <span className="prediction-label">Percentage:</span>
                                        <span className="prediction-value">{validationData.predictions.pima_model.percentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="prediction-item">
                                        <span className="prediction-label">Probability:</span>
                                        <span className="prediction-value">{(validationData.predictions.pima_model.probability * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Section */}
                    <div className="validation-section">
                        <h3 className="section-title">Model Comparison</h3>
                        <div className="comparison-grid">
                            <div className="comparison-item">
                                <span className="comparison-label">Models Agree:</span>
                                <span className="comparison-value" style={{ color: getAgreementColor(validationData.comparison.models_agree) }}>
                                    {validationData.comparison.models_agree ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="comparison-item">
                                <span className="comparison-label">Prediction Difference:</span>
                                <span className="comparison-value">{(validationData.comparison.prediction_difference * 100).toFixed(2)}%</span>
                            </div>
                            <div className="comparison-item">
                                <span className="comparison-label">Similar Cases:</span>
                                <span className="comparison-value">{validationData.comparison.similar_cases.count}</span>
                            </div>
                            <div className="comparison-item">
                                <span className="comparison-label">Average Prediction:</span>
                                <span className="comparison-value">{(validationData.comparison.similar_cases.average_prediction * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Validation Metrics Section */}
                    <div className="validation-section">
                        <h3 className="section-title">Validation Metrics</h3>
                        <div className="metrics-grid">
                            <div className="metric-item">
                                <span className="metric-label">Brier Score:</span>
                                <span className="metric-value">{validationData.validation_metrics.brier_score.toFixed(4)}</span>
                            </div>
                            <div className="metric-item">
                                <span className="metric-label">ROC AUC:</span>
                                <span className="metric-value">{validationData.validation_metrics.roc_auc.toFixed(4)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskValidationModal; 