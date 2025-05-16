"use client";
import React, { useState } from 'react';

const RiskAssessment = () => {
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        weight: '',
        height: '',
        familyHistory: false,
        physicalActivity: '',
        diet: '',
        smoking: false,
        alcohol: false,
        stress: '',
        sleep: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your risk assessment logic here
        console.log('Form submitted:', formData);
    };

    return (
        <div className="risk-assessment-container">
            <h1>Diabetes Risk Assessment</h1>
            <form onSubmit={handleSubmit} className="assessment-form">
                <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="height">Height (cm)</label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="familyHistory"
                            checked={formData.familyHistory}
                            onChange={handleChange}
                        />
                        Family History of Diabetes
                    </label>
                </div>

                <div className="form-group">
                    <label htmlFor="physicalActivity">Physical Activity Level</label>
                    <select
                        id="physicalActivity"
                        name="physicalActivity"
                        value={formData.physicalActivity}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Activity Level</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                        <option value="very-active">Very Active</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="diet">Diet Type</label>
                    <select
                        id="diet"
                        name="diet"
                        value={formData.diet}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Diet Type</option>
                        <option value="balanced">Balanced</option>
                        <option value="high-carb">High Carbohydrate</option>
                        <option value="low-carb">Low Carbohydrate</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                    </select>
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="smoking"
                            checked={formData.smoking}
                            onChange={handleChange}
                        />
                        Do you smoke?
                    </label>
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="alcohol"
                            checked={formData.alcohol}
                            onChange={handleChange}
                        />
                        Do you consume alcohol?
                    </label>
                </div>

                <div className="form-group">
                    <label htmlFor="stress">Stress Level</label>
                    <select
                        id="stress"
                        name="stress"
                        value={formData.stress}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Stress Level</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="sleep">Average Sleep (hours)</label>
                    <input
                        type="number"
                        id="sleep"
                        name="sleep"
                        value={formData.sleep}
                        onChange={handleChange}
                        min="0"
                        max="24"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">
                    Assess Risk
                </button>
            </form>
        </div>
    );
};

export default RiskAssessment; 