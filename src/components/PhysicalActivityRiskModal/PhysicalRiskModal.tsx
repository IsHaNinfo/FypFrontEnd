"use client";

import React, { useState, useEffect } from 'react';
import "./physicalrisk.css"
import axios from 'axios';
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from '../../services/api';

interface PhysicalRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
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
}

interface PhysicalAssessment {
    id: string;
    timestamp: string;
    formData: FormData;
    prediction: number;
}

const PhysicalRiskModal: React.FC<PhysicalRiskModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        age: '',
        gender: '',
        height: '',
        weight: '',
        EnergyLevels: '',
        PhysicalActivity: '',
        SittingTime: '',
        CardiovascularHealth: '',
        MuscleStrength: '',
        Flexibility: '',
        Balance: '',
        Thirsty: '',
        PainOrDiscomfort: '',
        AvailableTime: '',
        Diabetic_Risk: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) return;

                const { email } = JSON.parse(userData);
                console.log("email", email);

                const response = await axios.get(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_EMAIL(email)));
                const users = response.data;

                if (users && users.length > 0) {
                    const user = users[0];
                    const latestAssessment = user.diabeticAssessments
                        ?.[user.diabeticAssessments.length - 1];

                    if (latestAssessment && latestAssessment.formData) {
                        const { age, gender, height, weight } = latestAssessment.formData;
                        const diabeticRisk = latestAssessment.prediction?.toString() || '0';

                        setFormData(prev => ({
                            ...prev,
                            age: age || '',
                            gender: gender || '',
                            height: height || '',
                            weight: weight || '',
                            Diabetic_Risk: diabeticRisk
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateUserAssessment = async (assessment: PhysicalAssessment) => {
        try {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                throw new Error("User not logged in");
            }

            const { email } = JSON.parse(userData);
            const userResponse = await axios.get(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_EMAIL(email)));
            const users = userResponse.data;

            if (!users || users.length === 0) {
                throw new Error("User not found");
            }

            const user = users[0];
            const latestDiabeticAssessment = user.diabeticAssessments?.[user.diabeticAssessments.length - 1];
            const diabeticRisk = latestDiabeticAssessment?.prediction?.toString() || '0';

            const newPhysicalAssessment = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                formData: {
                    ...formData,
                    Diabetic_Risk: diabeticRisk
                },
                physicalRiskPrediction: assessment.prediction
            };

            const updatedUser = {
                ...user,
                physicalAssessments: [
                    ...(user.physicalAssessments || []),
                    newPhysicalAssessment
                ]
            };

            const response = await axios.put(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_ID(user.id)), updatedUser);
            return response.data;
        } catch (error) {
            console.error('Error updating assessment:', error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const currentUser = localStorage.getItem('userData');
            if (!currentUser) {
                throw new Error("User not logged in");
            }

            const formattedData = {
                age: parseFloat(formData.age) || 0,
                gender: parseFloat(formData.gender) || 0,
                height: parseFloat(formData.height) || 0,
                weight: parseFloat(formData.weight) || 0,
                EnergyLevels: parseFloat(formData.EnergyLevels) || 0,
                Physical_Activity: parseFloat(formData.PhysicalActivity) || 0,
                Sitting_Time: formData.SittingTime === 'Yes' ? 1 : 0,
                Cardiovascular_Health: formData.CardiovascularHealth === 'Yes' ? 1 : 0,
                Muscle_Strength: formData.MuscleStrength === 'Yes' ? 1 : 0,
                Flexibility: formData.Flexibility === 'Yes' ? 1 : 0,
                Balance: formData.Balance === 'Yes' ? 1 : 0,
                Thirsty: parseFloat(formData.Thirsty) || 0,
                Pain_or_Discomfort: formData.PainOrDiscomfort === 'Yes' ? 1 : 0,
                Available_Time: parseFloat(formData.AvailableTime) || 0,
                DiabetesRisk: parseFloat(formData.Diabetic_Risk) || 0
            };

            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("formattedData", formattedData);
            const response = await axios.post(getAiModelUrl(API_CONFIG.AI_MODEL.ENDPOINTS.PHYSICAL_RISK_PREDICTION), formattedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const predictionValue = response.data.prediction;
            setPrediction(predictionValue);

            const assessment: PhysicalAssessment = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                formData: {
                    ...formData,
                    Diabetic_Risk: formData.Diabetic_Risk
                },
                prediction: predictionValue
            };

            await updateUserAssessment(assessment);
            setShowResult(true);
            onClose();
        } catch (error: any) {
            console.error("Error:", error);
            if (error.message === "User not logged in") {
                alert("Please log in to save your assessment.");
            } else if (error.code === 'ERR_NETWORK') {
                alert("Cannot connect to the server. Please make sure the backend server is running on port 5000.");
            } else if (error.response) {
                alert(`Error: ${error.response.data.error || 'Server error occurred'}`);
            } else if (error.request) {
                alert("No response received from server. Please try again.");
            } else {
                alert("Error: " + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Do you feel tired or lack energy after mild activity? (1-10)</label>
                        <select
                            className="form-control"
                            name="EnergyLevels"
                            value={formData.EnergyLevels}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Energy Level</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">How often do you exercise or move during the day?(1-5)</label>
                        <select
                            className="form-control"
                            name="PhysicalActivity"
                            value={formData.PhysicalActivity}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Activity Level</option>
                            {[...Array(5)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Do you spend most of the time sitting?</label>
                        <select
                            className="form-control"
                            name="SittingTime"
                            value={formData.SittingTime}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Do you feel out of breath after climbing a few stairs?</label>
                        <select
                            className="form-control"
                            name="CardiovascularHealth"
                            value={formData.CardiovascularHealth}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Do you find it difficult to hold or lift heavy objects?</label>
                        <select
                            className="form-control"
                            name="MuscleStrength"
                            value={formData.MuscleStrength}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Can you touch your toes during a sit-and-reach test?</label>
                        <select
                            className="form-control"
                            name="Flexibility"
                            value={formData.Flexibility}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Can you balance on one leg for more than 5 seconds?</label>
                        <select
                            className="form-control"
                            name="Balance"
                            value={formData.Balance}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">How much water do you drink daily? (1-10)</label>
                        <select
                            className="form-control"
                            name="Thirsty"
                            value={formData.Thirsty}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Thirst Level</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Do you feel pain in your joints or muscles during movement?</label>
                        <select
                            className="form-control"
                            name="PainOrDiscomfort"
                            value={formData.PainOrDiscomfort}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">How many hours do you typically spend working in the office each day?</label>
                        <input
                            className="form-control"
                            type="number"
                            name="AvailableTime"
                            value={formData.AvailableTime}
                            onChange={handleInputChange}
                            placeholder="Enter available time in hours"
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button className="btn btn-primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
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