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
        "Saving your assessment...",
        "Almost done..."
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get email from localStorage
                const storedUser = localStorage.getItem('userData');

                console.log("sss", storedUser);
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

            const predictionValue = response.data.prediction;
            setPrediction(predictionValue);

            // Step 3: Saving assessment
            setLoadingStep(2);
            const assessment: DiabeticAssessment = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                formData: formData,
                prediction: predictionValue
            };

            // Update user's assessments in db.json
            await updateUserAssessment(assessment);

            // Step 4: Finalizing
            setLoadingStep(3);
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log("Assessment saved:", assessment);
            setShowResult(true);
            if (onPredictionComplete) {
                onPredictionComplete(predictionValue);
            }
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
                <div className="diabetic-modal-header">
                    <h2>Diabetic Risk Assessment</h2>
                </div>
                {isLoading ? (
                    <div className="loading-container">
                        <svg aria-hidden="true" className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="mt-6 text-xl text-white-700 font-semibold">{loadingMessages[loadingStep]}</span>
                    </div>
                ) : (
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
                            <label className="diabetic-modal-form-label">What is your height?  Please enter your height in centimeters (eg: 170 cm)</label>
                            <input className="diabetic-modal-form-control" name="height" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">What is your weight? ( Please enter your weight in kilograms (eg: 65 kg)    </label>
                            <input className="diabetic-modal-form-control" name="weight" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label"> What is your waist circumference?( Please measure your waist at the narrowest point and enter the value in centimeters (eg: 32 inch))</label>
                            <input className="diabetic-modal-form-control" name="Waist_Circumference" type="number" onChange={handleChange} required />
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label"> How often do you eat sugary snacks, fast food, or processed meals? (Per Day)</label>
                            <select className="diabetic-modal-form-control" name="Diet_Food_Habits" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select</option>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1} Meal{i + 1 > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do any of your family members have diabetes?</label>
                            <select className="diabetic-modal-form-control" name="Family_History" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you have high blood pressure ?</label>
                            <select className="diabetic-modal-form-control" name="Blood_Pressure" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you have high cholesterol ?</label>
                            <select className="diabetic-modal-form-control" name="Cholesterol_Lipid_Levels" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you feel unusually thirsty or hungry, even after eating?</label>
                            <select className="diabetic-modal-form-control" name="Thirst" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you often feel tired or lack energy, even after a full night's sleep? </label>
                            <select className="diabetic-modal-form-control" name="Fatigue" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Do you need to urinate more often, especially during the night? (Urination)</label>
                            <select className="diabetic-modal-form-control" name="Urination" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Have you noticed blurry vision or any other vision problems? (Vision Changes)</label>
                            <select className="diabetic-modal-form-control" name="Vision_Changes" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select an Option</option>
                                <option value="1.0">Yes</option>
                                <option value="0.0">No</option>
                            </select>
                        </div>
                        <div className="diabetic-modal-mb-3">
                            <label className="diabetic-modal-form-label">Expected Diabetic Risk (Risk Level)</label>
                            <select className="diabetic-modal-form-control" name="RiskLevel" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Select Risk</option>
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
                )}
            </div>
        </div>
    );
};

export default DiabeticRiskModal;
