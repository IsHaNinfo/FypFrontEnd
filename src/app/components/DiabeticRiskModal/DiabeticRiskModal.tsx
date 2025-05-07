"use client";
import React from 'react';
import "./diabeticriskmodal.css"; // Import the external CSS file

interface DiabeticRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DiabeticRiskModal: React.FC<DiabeticRiskModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='modal-header'>
                <h2>Diabetic Risk Assessment</h2>
                </div>
                <form className="modal-form">
                    <div className="mb-3">
                        <label className="form-label">Age</label>
                        <input
                            className="form-control"
                            type="number"
                            name="age"
                            placeholder="Enter your age"
                            min="20"
                            max="50"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select className="form-control" name="gender" required>
                            <option className="placeholder" selected disabled value="">
                                Select your Gender
                            </option>
                            <option value="1.0">Male</option>
                            <option value="0.0">Female</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Height (in cm)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="height"
                            placeholder="Enter your Height"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Weight (in kg)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="weight"
                            placeholder="Enter your Weight"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Waist Circumference (in cm)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="Waist_Circumference"
                            placeholder="Enter your Waist Circumference"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Diet Food Habits (Meals per Day)</label>
                        <select className="form-control" name="Diet_Food_Habits" required>
                            <option className="placeholder" selected disabled value="">
                                Select Meals per Day
                            </option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1} Meal{i + 1 > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Family History (Do any family members have diabetes?)</label>
                        <select className="form-control" name="Family_History" required>
                            <option className="placeholder" selected disabled value="">
                                Select an Option
                            </option>
                            <option value="1.0">Yes</option>
                            <option value="0.0">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">High Blood Pressure (Do you have high blood pressure continuously?)</label>
                        <select className="form-control" name="Blood_Pressure" required>
                            <option className="placeholder" selected disabled value="">
                                Select an Option
                            </option>
                            <option value="1.0">Yes</option>
                            <option value="0.0">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Expected Diabetic Risk (Risk Level)</label>
                        <select className="form-control" name="RiskLevel" required>
                            <option className="placeholder" selected disabled value="">
                                Select Risk Level
                            </option>
                            <option value="0.0">Low</option>
                            <option value="1.0">Moderate</option>
                            <option value="2.0">High</option>
                        </select>
                    </div>
                    <div className="button-group">
                        <button className="btn btn-primary" type="submit" value="Submit ">Submit</button>
                        <button className="modal-close-btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default DiabeticRiskModal;