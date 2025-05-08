"use client";

import React, { useState, useEffect } from 'react'
import "./nutritionrisk.css"; // Import the external CSS file
import axios from 'axios';

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
}

interface DiabeticAssessment {
    id: string;
    timestamp: string;
    formData: FormData;
    prediction: number;
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
        Sugar_Consumption: ''
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
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                const users = response.data;
                console.log("users", users);

                if (users && users.length > 0) {
                    const user = users[0];
                    // Get the latest assessment if available
                    const latestAssessment = user.diabeticAssessments
                        ?.[user.diabeticAssessments.length - 1];

                    console.log("latestAssessment", latestAssessment);

                    if (latestAssessment && latestAssessment.formData) {
                        const { age, gender, height, weight } = latestAssessment.formData;
                        console.log("Extracted data:", { age, gender, height, weight });

                        // Ensure age is a string and not undefined
                        const ageValue = age ? age.toString() : '';

                        setFormData(prev => ({
                            ...prev,
                            age: age || '',
                            gender: gender || '',
                            height: height || '',
                            weight: weight || ''
                        }));

                        console.log("Updated formData:", {
                            age: ageValue,
                            gender: gender || '',
                            height: height || '',
                            weight: weight || ''
                        });
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
            const response = await axios.post('http://localhost:8000/assessments', assessment);
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
                Sugar_Consumption: parseFloat(formData.Sugar_Consumption) || 0
            };

            console.log("formattedData", formattedData);
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await axios.post("http://127.0.0.1:5000/nutritionriskprediction", formattedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const predictionValue = response.data.prediction;
            setPrediction(predictionValue);
            console.log("predictionValue", predictionValue);

            // Create assessment object with the original form data
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
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Carbohydrate Consumption (g/day)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="Carbohydrate_Consumption"
                            value={formData.Carbohydrate_Consumption}
                            onChange={handleInputChange}
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
                            value={formData.Protein_Intake}
                            onChange={handleInputChange}
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
                            value={formData.Fat_Intake}
                            onChange={handleInputChange}
                            placeholder="Enter daily fat intake"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Regularity of Meals</label>
                        <select
                            className="form-control"
                            name="Regularity_of_Meals"
                            value={formData.Regularity_of_Meals}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Meal Regularity</option>
                            <option value="1.0">Very Regular</option>
                            <option value="2.0">Regular</option>
                            <option value="3.0">Sometimes Irregular</option>
                            <option value="4.0">Irregular</option>
                            <option value="5.0">Very Irregular</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Portion Control</label>
                        <select
                            className="form-control"
                            name="Portion_Control"
                            value={formData.Portion_Control}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Portion Control</option>
                            <option value="1.0">Excellent</option>
                            <option value="2.0">Good</option>
                            <option value="3.0">Moderate</option>
                            <option value="4.0">Poor</option>
                            <option value="5.0">Very Poor</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Caloric Balance</label>
                        <select
                            className="form-control"
                            name="Caloric_Balance"
                            value={formData.Caloric_Balance}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Caloric Balance</option>
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
                            value={formData.Sugar_Consumption}
                            onChange={handleInputChange}
                            placeholder="Enter daily sugar intake"
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button className="btn btn-primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
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
