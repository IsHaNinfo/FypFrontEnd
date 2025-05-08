"use client";

import React from 'react';
import "./physicalrisk.css"
interface PhysicalRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PhysicalRiskModal: React.FC<PhysicalRiskModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-icon" onClick={onClose} type="button">
                    &times;
                </button>
                <div className='modal-header'>
                    <h2>Physical Risk Assessment</h2>
                </div>
                <form className="modal-form">
                    <div className="mb-3">
                        <label className="form-label">Energy Levels (1-10)</label>
                        <select className="form-control" name="EnergyLevels" required>
                            <option className="placeholder" selected disabled value="">Select Energy Level</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Physical Activity (1-5)</label>
                        <select className="form-control" name="PhysicalActivity" required>
                            <option className="placeholder" selected disabled value="">Select Activity Level</option>
                            {[...Array(5)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Sitting Time</label>
                        <select className="form-control" name="SittingTime" required>
                            <option className="placeholder" selected disabled value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Cardiovascular Health</label>
                        <select className="form-control" name="CardiovascularHealth" required>
                            <option className="placeholder" selected disabled value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Muscle Strength</label>
                        <select className="form-control" name="MuscleStrength" required>
                            <option className="placeholder" selected disabled value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Flexibility</label>
                        <select className="form-control" name="Flexibility" required>
                            <option className="placeholder" selected disabled value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Balance</label>
                        <select className="form-control" name="Balance" required>
                            <option className="placeholder" selected disabled value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Thirsty (1-10)</label>
                        <select className="form-control" name="Thirsty" required>
                            <option className="placeholder" selected disabled value="">Select Thirst Level</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Pain or Discomfort</label>
                        <select className="form-control" name="PainOrDiscomfort" required>
                            <option className="placeholder" selected disabled value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Available Time (minutes)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="AvailableTime"
                            placeholder="Enter available time in minutes"
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="modal-close-btn" onClick={onClose} type="button">
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PhysicalRiskModal;