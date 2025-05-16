"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./diabeticriskmodal.css";
import { ClipLoader } from "react-spinners";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    diabeticAssessments?: DiabeticAssessment[];
}

interface DiabeticRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DiabeticAssessment {
    id: string;
    timestamp: string;
    formData: any;
    prediction: number;
}

const DiabeticRiskModal: React.FC<DiabeticRiskModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [prediction, setPrediction] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get email from localStorage
                const storedUser = localStorage.getItem('userData');

                console.log("sss",storedUser);
                if (storedUser) {
                    const { email } = JSON.parse(storedUser);

                    // Fetch user from db.json using email
                    const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                    if (response.data && response.data.length > 0) {
                        setCurrentUser(response.data[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const updateUserAssessment = async (assessment: DiabeticAssessment) => {
        if (!currentUser) return;

        try {
            // Get current user data
            const userResponse = await axios.get(`http://localhost:8000/users/${currentUser.id}`);
            const userData = userResponse.data;

            // Initialize diabeticAssessments array if it doesn't exist
            const updatedUser = {
                ...userData,
                diabeticAssessments: [...(userData.diabeticAssessments || []), assessment]
            };

            // Update user in db.json
            await axios.put(`http://localhost:8000/users/${currentUser.id}`, updatedUser);
        } catch (error) {
            console.error('Error updating user assessment:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!currentUser) {
                throw new Error("User not logged in");
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await axios.post("http://127.0.0.1:5000/predictdata", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const predictionValue = response.data.prediction;
            setPrediction(predictionValue);

            // Create assessment object
            const assessment: DiabeticAssessment = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                formData: formData,
                prediction: predictionValue
            };

            // Update user's assessments in db.json
            await updateUserAssessment(assessment);

            console.log("Assessment saved:", assessment);
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

    return (
        <div className="diabetic-modal-overlay">
            <div className="diabetic-modal-content">
                <div className="diabetic-modal-header">
                    <h2>Diabetic Risk Assessment</h2>
                </div>
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner">
                            <ClipLoader
                                color="#4CAF50"
                                loading={isLoading}
                                size={100}
                                aria-label="Loading Spinner"
                            />
                        </div>
                        <p>Predicting your Diabetic risk score...</p>
                    </div>
                ) : (
                    <form className="diabetic-modal-form" onSubmit={handleSubmit}>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Age</label>
                            <input className="diabetic-modal-form-control" name="age" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Gender</label>
                            <select className="diabetic-modal-form-control" name="gender" onChange={handleChange} required>
                                <option disabled selected value="">Select Gender</option>
                                <option value="1.0">Male</option>
                                <option value="0.0">Female</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Height (in cm)</label>
                            <input className="diabetic-modal-form-control" name="height" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Weight (in kg)</label>
                            <input className="diabetic-modal-form-control" name="weight" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Waist Circumference (in cm)</label>
                            <input className="diabetic-modal-form-control" name="Waist_Circumference" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Diet Food Habits</label>
                            <select className="diabetic-modal-form-control" name="Diet_Food_Habits" onChange={handleChange} required>
                                <option disabled selected value="">Select</option>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1} Meal{i + 1 > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Family History</label>
                            <select className="diabetic-modal-form-control" name="Family_History" onChange={handleChange} required>
                                <option disabled selected value="">Select</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">High Blood Pressure</label>
                            <select className="diabetic-modal-form-control" name="Blood_Pressure" onChange={handleChange} required>
                                <option disabled selected value="">Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Cholesterol / Lipid Levels</label>
                            <select className="diabetic-modal-form-control" name="Cholesterol_Lipid_Levels" onChange={handleChange} required>
                                <option disabled selected value="">Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Thirst / Hunger</label>
                            <select className="diabetic-modal-form-control" name="Thirst" onChange={handleChange} required>
                                <option disabled selected value="">Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Fatigue</label>
                            <select className="diabetic-modal-form-control" name="Fatigue" onChange={handleChange} required>
                                <option disabled selected value="">Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Urination</label>
                            <select className="diabetic-modal-form-control" name="Urination" onChange={handleChange} required>
                                <option disabled selected value="">Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Vision Changes</label>
                            <select className="diabetic-modal-form-control" name="Vision_Changes" onChange={handleChange} required>
                                <option disabled selected value="">Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Expected Diabetic Risk (Risk Level)</label>
                            <select className="diabetic-modal-form-control" name="RiskLevel" onChange={handleChange} required>
                                <option disabled selected value="">Select Risk</option>
                                <option value="0.0">Low</option>
                                <option value="1.0">Moderate</option>
                                <option value="2.0">High</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-button-group">
                            <button
                                className="diabetic-modal-btn-primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Calculating...' : 'Submit'}
                            </button>
                            <button
                                className="diabetic-modal-close-btn"
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DiabeticRiskModal;
