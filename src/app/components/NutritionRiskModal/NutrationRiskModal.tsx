"use client";

import React from 'react'
import "./nutritionrisk.css"; // Import the external CSS file

interface NutrationRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NutrationRiskModal: React.FC<NutrationRiskModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-icon" onClick={onClose} type="button">
                    &times;
                </button>
                <div className='modal-header'>
                    <h2>Nutrition Risk Assessment</h2>
                </div>
                <form className="modal-form">
                    <div className="mb-3">
                        <label className="form-label">Carbohydrate Consumption (g/day)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="Carbohydrate_Consumption"
                            placeholder="Enter daily carbohydrate intake"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Protein Intake (g/day)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="Protein_Intake"
                            placeholder="Enter daily protein intake"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Fat Intake (g/day)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="Fat_Intake"
                            placeholder="Enter daily fat intake"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Regularity of Meals</label>
                        <select className="form-control" name="Regularity_of_Meals" required>
                            <option className="placeholder" selected disabled value="">
                                Select Meal Regularity
                            </option>
                            <option value="1.0">Very Regular</option>
                            <option value="2.0">Regular</option>
                            <option value="3.0">Sometimes Irregular</option>
                            <option value="4.0">Irregular</option>
                            <option value="5.0">Very Irregular</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Portion Control</label>
                        <select className="form-control" name="Portion_Control" required>
                            <option className="placeholder" selected disabled value="">
                                Select Portion Control
                            </option>
                            <option value="1.0">Excellent</option>
                            <option value="2.0">Good</option>
                            <option value="3.0">Moderate</option>
                            <option value="4.0">Poor</option>
                            <option value="5.0">Very Poor</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Caloric Balance</label>
                        <select className="form-control" name="Caloric_Balance" required>
                            <option className="placeholder" selected disabled value="">
                                Select Caloric Balance
                            </option>
                            <option value="1.0">Caloric Deficit</option>
                            <option value="2.0">Maintenance</option>
                            <option value="3.0">Caloric Surplus</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Sugar Consumption (g/day)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="Sugar_Consumption"
                            placeholder="Enter daily sugar intake"
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="modal-close-btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NutrationRiskModal
