"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./diabeticriskmodal.css";
import { ClipLoader } from "react-spinners";
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from '../../services/api';

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
    onPredictionComplete?: (prediction: number) => void;
}

interface DiabeticAssessment {
    id: string;
    timestamp: string;
    formData: any;
    prediction: number;
    validationData?: any;
}

const DiabeticRiskModal: React.FC<DiabeticRiskModalProps> = ({ isOpen, onClose, onPredictionComplete }) => {
    const [formData, setFormData] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [prediction, setPrediction] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const loadingMessages = [
        "Analyzing your health data...",
        "Calculating diabetic risk score...",
        "Validating prediction...",
        "Saving your assessment...",
        "Almost done..."
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get email from localStorage
                const storedUser = localStorage.getItem('userData');

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
            const userResponse = await axios.get(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_EMAIL(currentUser.email)));
            const userData = userResponse.data[0];

            if (!userData) {
                throw new Error("User not found");
            }

            // Initialize diabeticAssessments array if it doesn't exist
            const updatedUser = {
                ...userData,
                diabeticAssessments: [...(userData.diabeticAssessments || []), assessment]
            };

            // Update user in db.json using the correct endpoint
            await axios.put(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_ID(userData.id)), updatedUser);
        } catch (error) {
            console.error('Error updating user assessment:', error);
            throw error; // Re-throw to handle in the parent function
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLoadingStep(0);

        try {
            if (!currentUser) {
                throw new Error("User not logged in");
            }

            // Step 1: Analyzing data
            setLoadingStep(0);
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 2: Getting prediction
            setLoadingStep(1);
            const response = await axios.post(getAiModelUrl(API_CONFIG.AI_MODEL.ENDPOINTS.DIABETIC_RISK_PREDICTION), formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("response", response.data);

            // Extract prediction and validation data from the new response structure
            const { predictions, summary, validation_metrics, comparison, similar_cases } = response.data;

            // You can choose which model's prediction to use as the main prediction
            // Here, we use your_model's probability as the main prediction value
            const predictionValue = predictions?.your_model?.probability ?? 0;

            // Prepare validationData to store in db.json
            const validationData = {
                predictions,
                summary,
                validation_metrics,
                comparison,
                similar_cases
            };

            setPrediction(predictionValue);

            // Step 4: Saving assessment with validation data
            setLoadingStep(3);
            const assessment: DiabeticAssessment = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                formData: formData,
                prediction: predictionValue,
                validationData: validationData
            };

            // Update user's assessments in db.json
            await updateUserAssessment(assessment);

            // Step 5: Finalizing
            setLoadingStep(4);
            await new Promise(resolve => setTimeout(resolve, 1000));

            setShowResult(true);
            if (onPredictionComplete) {
                onPredictionComplete(predictionValue);
            }

            // Dispatch custom event to notify other components about the update
            const event = new CustomEvent('diabeticAssessmentUpdated', {
                detail: {
                    prediction: predictionValue,
                    validationData: validationData
                }
            });
            window.dispatchEvent(event);

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
            setLoadingStep(0);
        }
    };

    return (
        <div className="diabetic-modal-overlay">
            <div className="diabetic-modal-content">
                <button className="modal-close-icon" onClick={onClose} type="button">
                    &times;
                </button>
                <div className="diabetic-modal-header">
                    <h2>Diabetic Risk Assessment</h2>
                </div>
                    <form className="diabetic-modal-form" onSubmit={handleSubmit}>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">What is your age?(Age)</label>
                            <input className="diabetic-modal-form-control" name="age" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">  What is your gender?  (Gender)</label>
                            <select className="diabetic-modal-form-control" name="gender" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select Gender</option>
                                <option value="1.0">Male</option>
                                <option value="0.0">Female</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">What is your height?  (eg: 170 cm)</label>
                            <input className="diabetic-modal-form-control" name="height" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">What is your weight?  (eg: 65 kg)    </label>
                            <input className="diabetic-modal-form-control" name="weight" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label"> What is your waist circumference? (eg: 32 inch)</label>
                            <input className="diabetic-modal-form-control" name="Waist_Circumference" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label"> How often do you eat sugary snacks, fast food, or processed meals? (Per Day)</label>
                            <select className="diabetic-modal-form-control" name="Diet_Food_Habits" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1} Meal{i + 1 > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do any of your family members have diabetes?</label>
                            <select className="diabetic-modal-form-control" name="Family_History" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you have high blood pressure ?</label>
                            <select className="diabetic-modal-form-control" name="Blood_Pressure" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you have high cholesterol ?</label>
                            <select className="diabetic-modal-form-control" name="Cholesterol_Lipid_Levels" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you feel unusually thirsty or hungry, even after eating?</label>
                            <select className="diabetic-modal-form-control" name="Thirst" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you often feel tired or lack energy, even after a full night's sleep? </label>
                            <select className="diabetic-modal-form-control" name="Fatigue" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you need to urinate more often, especially during the night? (Urination)</label>
                            <select className="diabetic-modal-form-control" name="Urination" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Have you noticed blurry vision or any other vision problems? (Vision Changes)</label>
                            <select className="diabetic-modal-form-control" name="Vision_Changes" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Expected Diabetic Risk (Risk Level)</label>
                            <select className="diabetic-modal-form-control" name="RiskLevel" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select Risk</option>
                                <option value="Low">Low</option>
                                <option value="Moderate">Moderate</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-button-group">
                            <button
                                className="diabetic-modal-btn-primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Predicting...' : 'Submit'}
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
            </div>
        </div>
    );
};

export default DiabeticRiskModal;
