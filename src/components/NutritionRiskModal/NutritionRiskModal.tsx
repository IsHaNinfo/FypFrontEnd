"use client";

import React, { useState, useEffect } from 'react'
import "./nutritionrisk.css"; // Import the external CSS file
import axios from 'axios';
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from '../../services/api';

interface NutrationRiskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    age: string;
    gender: string;
    height: string;
    weight: string;
    Carbohydrate_Consumption: string;
    Protein_Intake: string;
    Fat_Intake: string;
    Regularity_of_Meals: string;
    Portion_Control: string;
    Caloric_Balance: string;
    Sugar_Consumption: string;
    Diabetic_Risk: string;
}

interface DiabeticAssessment {
    id: string;
    timestamp: string;
    formData: FormData;
    prediction: number;
    feature_contributions?: {
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
    };
}

const NutrationRiskModal: React.FC<NutrationRiskModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        age: '',
        gender: '',
        height: '',
        weight: '',
        Carbohydrate_Consumption: '',
        Protein_Intake: '',
        Fat_Intake: '',
        Regularity_of_Meals: '',
        Portion_Control: '',
        Caloric_Balance: '',
        Sugar_Consumption: '',
        Diabetic_Risk: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get user email from localStorage
                const userData = localStorage.getItem('userData');
                if (!userData) return;

                const { email } = JSON.parse(userData);
                console.log("email", email);

                // Fetch user data from db.json
                const response = await axios.get(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_EMAIL(email)));
                const users = response.data;

                if (users && users.length > 0) {
                    const user = users[0];
                    // Get the latest assessment if available
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

    const updateUserAssessment = async (assessment: DiabeticAssessment) => {
        try {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                throw new Error("User not logged in");
            }

            const { email } = JSON.parse(userData);

            // First get the user to find their ID
            const userResponse = await axios.get(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_EMAIL(email)));
            const users = userResponse.data;

            if (!users || users.length === 0) {
                throw new Error("User not found");
            }

            const user = users[0];

            // Get the latest diabetic assessment to get the diabetic risk
            const latestDiabeticAssessment = user.diabeticAssessments?.[user.diabeticAssessments.length - 1];
            const diabeticRisk = latestDiabeticAssessment?.prediction?.toString() || '0';

            // Create a new nutrition assessment object
            const newNutritionAssessment = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                formData: {
                    age: formData.age,
                    gender: formData.gender,
                    height: formData.height,
                    weight: formData.weight,
                    Carbohydrate_Consumption: formData.Carbohydrate_Consumption,
                    Protein_Intake: formData.Protein_Intake,
                    Fat_Intake: formData.Fat_Intake,
                    Regularity_of_Meals: formData.Regularity_of_Meals,
                    Portion_Control: formData.Portion_Control,
                    Caloric_Balance: formData.Caloric_Balance,
                    Sugar_Consumption: formData.Sugar_Consumption,
                    Diabetic_Risk: diabeticRisk
                },
                nutritionRiskPrediction: [assessment.prediction],
                feature_contributions: assessment.feature_contributions
            };

            // Add the new assessment to the user's nutritionAssessments array
            const updatedUser = {
                ...user,
                nutritionAssessments: [
                    ...(user.nutritionAssessments || []),
                    newNutritionAssessment
                ]
            };

            // Update the user with the new assessment
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
            // Format the data to ensure all values are numbers
            const formattedData = {
                age: parseFloat(formData.age) || 0,
                gender: parseFloat(formData.gender) || 0,
                height: parseFloat(formData.height) || 0,
                weight: parseFloat(formData.weight) || 0,
                Carbohydrate_Consumption: parseFloat(formData.Carbohydrate_Consumption) || 0,
                Protein_Intake: parseFloat(formData.Protein_Intake) || 0,
                Fat_Intake: parseFloat(formData.Fat_Intake) || 0,
                Regularity_of_Meals: parseFloat(formData.Regularity_of_Meals) || 0,
                Portion_Control: parseFloat(formData.Portion_Control) || 0,
                Caloric_Balance: parseFloat(formData.Caloric_Balance) || 0,
                DiabetesRisk: parseFloat(formData.Diabetic_Risk) || 0,
                Sugar_Consumption: parseFloat(formData.Sugar_Consumption) || 0
            };

            console.log("formattedData", formattedData);
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await axios.post(getAiModelUrl(API_CONFIG.AI_MODEL.ENDPOINTS.NUTRITION_RISK_PREDICTION), formattedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("response", response.data);
            const predictionValue = response.data.prediction;
            const featureContributions = response.data.feature_contributions;
            setPrediction(predictionValue);

            // Create assessment object with feature contributions
            const assessment: DiabeticAssessment = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                formData: {
                    ...formData,
                    Diabetic_Risk: formData.Diabetic_Risk
                },
                prediction: predictionValue,
                feature_contributions: featureContributions
            };

            // Update user's assessments in db.json
            await updateUserAssessment(assessment);

            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('nutritionAssessmentUpdated', {
                detail: {
                    prediction: predictionValue,
                    featureContributions: featureContributions
                }
            }));

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

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        /*<div className="nutrition-modal-overlay">
            <div className="nutrition-modal-content">
                <button className="nutrition-modal-close" onClick={onClose} type="button">
                    &times;
                </button>
                <div className='nutrition-modal-head'>
                    <h2>Nutrition Risk Assessment</h2>
                </div>
                <form className="nutrition-modal-form" onSubmit={handleSubmit}>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">How many servings of rice, bread, or pasta do you eat daily?(Carbohydrate Consumption) (g/day)</label>
                        <select
                            className="form-control"
                            name="Carbohydrate_Consumption"
                            value={formData.Carbohydrate_Consumption}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="1.0">1</option>
                            <option value="2.0">2</option>
                            <option value="3.0">3</option>
                            <option value="4.0">4</option>
                            <option value="5.0">5</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">How often do you include protein sources (e.g., eggs, chicken, lentils) in your meals? (Protein Intake) </label>
                        <select
                            className="form-control"
                            name="Protein_Intake"
                            value={formData.Protein_Intake}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">What type of fats do you consume most frequently? (Fat Intake) </label>
                        <select
                            className="form-control"
                            name="Fat_Intake"
                            value={formData.Fat_Intake}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Healthy fats">Healthy fats</option>
                            <option value="Unhealthy fats">Unhealthy fats</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">Do you skip meals during the day? (Regularity of Meals)</label>
                        <select
                            className="form-control"
                            name="Regularity_of_Meals"
                            value={formData.Regularity_of_Meals}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">How large are your portions on average (in cups or plates per meal) (Portion Control) ?</label>
                        <select
                            className="form-control"
                            name="Portion_Control"
                            value={formData.Portion_Control}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Portion Size</option>
                            <option value="1.0">Small (1/2 plate or 1 cup)</option>
                            <option value="2.0">Small-Medium (3/4 plate or 1.5 cups)</option>
                            <option value="3.0">Medium (1 plate or 2 cups)</option>
                            <option value="4.0">Medium-Large (1.5 plates or 3 cups)</option>
                            <option value="5.0">Large (2 plates or 4 cups)</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">What is your estimated daily calorie intake (if known)?(e.g., 2000 calories per day) </label>
                        <input
                            className="form-control"
                            type="number"
                            name="Caloric_Balance"
                            value={formData.Caloric_Balance}
                            onChange={handleInputChange}
                            placeholder="Enter daily calorie intake"
                            required
                        />

                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">How many sugary snacks or drinks do you consume in a day? (Sugar Consumption) (g/day)</label>
                        <select
                            className="form-control"
                            name="Sugar_Consumption"
                            value={formData.Sugar_Consumption}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="1.0">1</option>
                            <option value="2.0">2</option>
                            <option value="3.0">3</option>
                            <option value="4.0">4</option>
                            <option value="5.0">5</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-button-group">
                        <button
                            className="nutrition-modal-btn-primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Predicting...' : 'Submit'}
                        </button>
                        <button
                            className="nutrition-modal-close-btn"
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>*/
        <div className="nutrition-modal-overlay">
            <div className="nutrition-modal-content">
                <button className="modal-close-icon" onClick={onClose} type="button">
                    &times;
                </button>
                <div className="nutrition-modal-header">
                    <h2>Nutrition Risk Assessment</h2>
                </div>
                    <form className="nutrition-modal-form" onSubmit={handleSubmit}>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">How many servings of rice, bread, or pasta do you eat daily?(Carbohydrate Consumption) (g/day)</label>
                        <select
                            className="form-control"
                            name="Carbohydrate_Consumption"
                            value={formData.Carbohydrate_Consumption}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="1.0">1</option>
                            <option value="2.0">2</option>
                            <option value="3.0">3</option>
                            <option value="4.0">4</option>
                            <option value="5.0">5</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">How often do you include protein sources (e.g., eggs, chicken, lentils) in your meals? (Protein Intake) </label>
                        <select
                            className="form-control"
                            name="Protein_Intake"
                            value={formData.Protein_Intake}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">What type of fats do you consume most frequently? (Fat Intake) </label>
                        <select
                            className="form-control"
                            name="Fat_Intake"
                            value={formData.Fat_Intake}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Healthy fats">Healthy fats</option>
                            <option value="Unhealthy fats">Unhealthy fats</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">Do you skip meals during the day? (Regularity of Meals)</label>
                        <select
                            className="form-control"
                            name="Regularity_of_Meals"
                            value={formData.Regularity_of_Meals}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">How large are your portions on average (in cups or plates per meal) (Portion Control) ?</label>
                        <select
                            className="form-control"
                            name="Portion_Control"
                            value={formData.Portion_Control}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Portion Size</option>
                            <option value="1.0">Small (1/2 plate or 1 cup)</option>
                            <option value="2.0">Small-Medium (3/4 plate or 1.5 cups)</option>
                            <option value="3.0">Medium (1 plate or 2 cups)</option>
                            <option value="4.0">Medium-Large (1.5 plates or 3 cups)</option>
                            <option value="5.0">Large (2 plates or 4 cups)</option>
                        </select>
                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">What is your estimated daily calorie intake (if known)?(e.g., 2000 calories per day) </label>
                        <input
                            className="form-control"
                            type="number"
                            name="Caloric_Balance"
                            value={formData.Caloric_Balance}
                            onChange={handleInputChange}
                            placeholder="Enter daily calorie intake"
                            required
                        />

                    </div>
                    <div className="nutrition-modal-mb-3">
                        <label className="nutrition-modal-form-label">How many sugary snacks or drinks do you consume in a day? (Sugar Consumption) (g/day)</label>
                        <select
                            className="form-control"
                            name="Sugar_Consumption"
                            value={formData.Sugar_Consumption}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Option</option>
                            <option value="1.0">1</option>
                            <option value="2.0">2</option>
                            <option value="3.0">3</option>
                            <option value="4.0">4</option>
                            <option value="5.0">5</option>
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

export default NutrationRiskModal
