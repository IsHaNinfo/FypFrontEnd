"use client";

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from '../../services/api';
import foodDataset from '../../data/Food_Datasets.csv';
import './nutritionrisk.css';

// --- Types ---
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

interface Suggestion {
    original: FoodItem;
    alternative: FoodItem;
}

interface FoodEstimatorProps {
    onEstimate: (calories: number, suggestions: Suggestion[]) => void;
}

interface FoodItem {
    food_id: string;
    food_item: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    glycemic_index: number;
    meal_type: string;
    culture: string;
    estimated_weight_g: number;
    portion_description: string;
}

// Add authentic Sri Lankan foods
const authenticFoods: FoodItem[] = [
    {
        food_id: 'auth_1',
        food_item: 'Rice and Curry (Large)',
        calories: 450,
        carbs: 85,
        protein: 12,
        fat: 9,
        glycemic_index: 73,
        meal_type: 'Main Meal',
        culture: 'Sri Lankan',
        estimated_weight_g: 300,
        portion_description: '1 large plate (2 cups rice, 3-4 curries)'
    },
    {
        food_id: 'auth_2',
        food_item: 'String Hoppers with Curry',
        calories: 350,
        carbs: 70,
        protein: 8,
        fat: 5,
        glycemic_index: 68,
        meal_type: 'Breakfast/Dinner',
        culture: 'Sri Lankan',
        estimated_weight_g: 250,
        portion_description: '5 string hoppers with dhal and pol sambol'
    },
    {
        food_id: 'auth_3',
        food_item: 'Kottu Roti (Regular)',
        calories: 550,
        carbs: 65,
        protein: 20,
        fat: 25,
        glycemic_index: 70,
        meal_type: 'Dinner',
        culture: 'Sri Lankan',
        estimated_weight_g: 400,
        portion_description: '1 regular portion with vegetables and egg'
    },
    {
        food_id: 'auth_4',
        food_item: 'Milk Rice with Lunu Miris',
        calories: 300,
        carbs: 55,
        protein: 6,
        fat: 8,
        glycemic_index: 65,
        meal_type: 'Breakfast',
        culture: 'Sri Lankan',
        estimated_weight_g: 200,
        portion_description: '2 pieces with spicy sambol'
    },
    {
        food_id: 'auth_5',
        food_item: 'Hoppers with Curry',
        calories: 280,
        carbs: 45,
        protein: 7,
        fat: 6,
        glycemic_index: 62,
        meal_type: 'Breakfast/Dinner',
        culture: 'Sri Lankan',
        estimated_weight_g: 180,
        portion_description: '3 plain hoppers with curry'
    }
];

const FoodEstimator: React.FC<FoodEstimatorProps> = ({ onEstimate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selections, setSelections] = useState<Record<string, number>>({});
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [randomFoods, setRandomFoods] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [foodData, setFoodData] = useState<FoodItem[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedFoodsList, setSelectedFoodsList] = useState<Array<{ food: FoodItem, quantity: number }>>([]);
    const [enteredFoods] = useState<FoodItem[]>([
        {
            food_id: 'entered_1',
            food_item: 'Rice and Curry',
            calories: 450,
            carbs: 85,
            protein: 12,
            fat: 9,
            glycemic_index: 73,
            meal_type: 'Main Meal',
            culture: 'Sri Lankan',
            estimated_weight_g: 300,
            portion_description: '1 large plate'
        },
        {
            food_id: 'entered_2',
            food_item: 'String Hoppers',
            calories: 350,
            carbs: 70,
            protein: 8,
            fat: 5,
            glycemic_index: 68,
            meal_type: 'Breakfast',
            culture: 'Sri Lankan',
            estimated_weight_g: 250,
            portion_description: '5 string hoppers'
        },
        {
            food_id: 'entered_3',
            food_item: 'Kottu Roti',
            calories: 550,
            carbs: 65,
            protein: 20,
            fat: 25,
            glycemic_index: 70,
            meal_type: 'Dinner',
            culture: 'Sri Lankan',
            estimated_weight_g: 400,
            portion_description: '1 regular portion'
        },
        {
            food_id: 'entered_4',
            food_item: 'Milk Rice',
            calories: 300,
            carbs: 55,
            protein: 6,
            fat: 8,
            glycemic_index: 65,
            meal_type: 'Breakfast',
            culture: 'Sri Lankan',
            estimated_weight_g: 200,
            portion_description: '2 pieces'
        },
        {
            food_id: 'entered_5',
            food_item: 'Hoppers',
            calories: 280,
            carbs: 45,
            protein: 7,
            fat: 6,
            glycemic_index: 62,
            meal_type: 'Breakfast/Dinner',
            culture: 'Sri Lankan',
            estimated_weight_g: 180,
            portion_description: '3 plain hoppers'
        }
    ]);
    const MAX_SELECTIONS = 10;

    useEffect(() => {
        try {
            setIsLoading(true);
            // Transform the imported CSV data to ensure numeric values
            const transformedData = foodDataset.map(item => ({
                food_id: item.food_id,
                food_item: item.food_item,
                calories: Math.round(parseFloat(item.calories) || 0), // Round to whole number
                carbs: parseFloat(item.carbs) || 0,
                protein: parseFloat(item.protein) || 0,
                fat: parseFloat(item.fat) || 0,
                glycemic_index: parseFloat(item.glycemic_index) || 0,
                meal_type: item.meal_type,
                culture: item.culture,
                estimated_weight_g: Math.round(parseFloat(item.estimated_weight_g) || 0), // Round to whole number
                portion_description: item.portion_description || ''
            }));

            // Get 5 random foods from CSV data
            const shuffled = [...transformedData].sort(() => 0.5 - Math.random());
            const selectedCsvFoods = shuffled.slice(0, 5);

            setFoodData(selectedCsvFoods);
            setRandomFoods(selectedCsvFoods);
        } catch (error) {
            console.error('Error processing food data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleQtyChange = (food_id: string, qty: number) => {
        const currentSelections = Object.keys(selections).filter(id => selections[id] > 0);

        if (qty > 0 && !selections[food_id] && currentSelections.length >= MAX_SELECTIONS) {
            alert(`You can only select up to ${MAX_SELECTIONS} foods. Please remove some selections first.`);
            return;
        }

        setSelections(prev => ({ ...prev, [food_id]: qty }));
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (!term.trim()) {
            // Show random foods when search is cleared
            const shuffled = [...foodData].sort(() => 0.5 - Math.random());
            setRandomFoods(shuffled.slice(0, 10));
        }
    };

    const filteredFoods = searchTerm
        ? [...foodData, ...enteredFoods].filter(food =>
            food.food_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
            food.meal_type.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [...randomFoods, ...enteredFoods];

    const getSelectedCount = () => {
        return Object.values(selections).filter(qty => qty > 0).length;
    };

    const calculate = async () => {
        let totalCalories = 0;
        const selectedFoods: FoodItem[] = [];
        const selectedFoodsWithQty: Array<{ food: FoodItem, quantity: number }> = [];

        // Process both entered foods and CSV foods
        [...enteredFoods, ...foodData].forEach(item => {
            const qty = selections[item.food_id] || 0;
            if (qty > 0) {
                totalCalories += item.calories * qty;
                selectedFoods.push(item);
                selectedFoodsWithQty.push({
                    food: item,
                    quantity: qty
                });
            }
        });

        // Find healthier alternatives
        const subs: Suggestion[] = [];
        selectedFoods.forEach(item => {
            const alternatives = foodData.filter(alt =>
                alt.meal_type === item.meal_type &&
                alt.calories < item.calories &&
                alt.glycemic_index <= item.glycemic_index &&
                alt.food_id !== item.food_id
            ).sort((a, b) => a.calories - b.calories);

            if (alternatives.length > 0) {
                subs.push({
                    original: item,
                    alternative: alternatives[0]
                });
            }
        });

        // Store selected foods in state
        setSelectedFoodsList(selectedFoodsWithQty);

        // Disable further selections
        setIsSubmitted(true);

        // Update the nutrition assessment in db.json
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const { email } = JSON.parse(userData);
                const response = await axios.get(getDatabaseUrl(`/users?email=${email}`));
                const user = response.data[0];

                if (user) {
                    const updatedUser = {
                        ...user,
                        selectedFoods: selectedFoodsWithQty.map(item => ({
                            food_id: item.food.food_id,
                            food_item: item.food.food_item,
                            calories: item.food.calories,
                            quantity: item.quantity,
                            meal_type: item.food.meal_type,
                            portion_description: item.food.portion_description
                        }))
                    };

                    await axios.put(getDatabaseUrl(`/users/${user.id}`), updatedUser);
                }
            }
        } catch (error) {
            console.error('Error saving selected foods:', error);
        }

        setSuggestions(subs);
        onEstimate(totalCalories, subs);
    };

    return (
        <div className="food-estimator">
            <div className="food-search-header">
                <h3>Select Foods You Consume</h3>
                <div className="selection-counter">
                    Selected: {getSelectedCount()}/{MAX_SELECTIONS}
                </div>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search for foods..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                    disabled={isLoading || isSubmitted}
                />
            </div>

            <div className="food-list">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading food database...</p>
                    </div>
                ) : filteredFoods.length === 0 ? (
                    <div className="no-results">
                        <p>No foods found matching your search.</p>
                    </div>
                ) : (
                    <>
                        <div className="food-section">
                            {enteredFoods.map((item: FoodItem) => (
                                <div key={item.food_id} className={`food-item-row entered ${isSubmitted ? 'submitted' : ''}`}>
                                    <label>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            value={selections[item.food_id] || ''}
                                            onChange={e => handleQtyChange(item.food_id, parseFloat(e.target.value) || 0)}
                                            className="serving-input"
                                            disabled={isSubmitted}
                                        />
                                        <div className="food-item-details">
                                            <span className="food-item-name">{item.food_item}</span>
                                            <div className="food-item-subdetails">
                                                <span className="food-item-type">{item.meal_type}</span>
                                                <span className="food-item-portion">{item.portion_description}</span>
                                            </div>
                                        </div>
                                        <span className="food-item-info">
                                            {item.calories} kcal / {item.estimated_weight_g}g
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="food-section">
                            {foodData.map((item: FoodItem) => (
                                <div key={item.food_id} className={`food-item-row ${isSubmitted ? 'submitted' : ''}`}>
                                    <label>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            value={selections[item.food_id] || ''}
                                            onChange={e => handleQtyChange(item.food_id, parseFloat(e.target.value) || 0)}
                                            className="serving-input"
                                            disabled={isSubmitted}
                                        />
                                        <div className="food-item-details">
                                            <span className="food-item-name">{item.food_item}</span>
                                            <div className="food-item-subdetails">
                                                <span className="food-item-type">{item.meal_type}</span>
                                                <span className="food-item-portion">{item.portion_description}</span>
                                            </div>
                                        </div>
                                        <span className="food-item-info">
                                            {Math.round(item.calories)} kcal / {Math.round(item.estimated_weight_g)}g
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {!isSubmitted && getSelectedCount() > 0 && (
                <button type="button" onClick={calculate} className="estimate-btn">
                    Calculate & Continue
                </button>
            )}

            {suggestions.length > 0 && (
                <div className="estimation-results">
                    <h5>Healthier Alternatives:</h5>
                    <ul>
                        {suggestions.map(s => (
                            <li key={s.original.food_id}>
                                Consider replacing "{s.original.food_item}" ({s.original.calories} kcal)
                                with "{s.alternative.food_item}" ({s.alternative.calories} kcal)
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isSubmitted && selectedFoodsList.length > 0 && (
                <div className="selected-foods-summary">
                    <h5>Selected Foods Summary:</h5>
                    <ul>
                        {selectedFoodsList.map(item => (
                            <li key={item.food.food_id}>
                                {item.quantity}x {item.food.food_item} ({item.food.calories * item.quantity} kcal total)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

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
    const [calorieOption, setCalorieOption] = useState<'manual' | 'food' | ''>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) return;

                const { email } = JSON.parse(userData);
                const response = await axios.get(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_EMAIL(email)));
                const users = response.data;

                if (users && users.length > 0) {
                    const user = users[0];
                    const latestAssessment = user.diabeticAssessments?.[user.diabeticAssessments.length - 1];

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

    useEffect(() => {
        setFormData(prev => ({ ...prev, Caloric_Balance: '' }));
    }, [calorieOption]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFoodEstimate = (calories: number, suggestions: Suggestion[]) => {
        setFormData(prev => ({ ...prev, Caloric_Balance: calories.toString() }));
    };

    const updateUserAssessment = async (assessment: DiabeticAssessment) => {
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

            const updatedUser = {
                ...user,
                nutritionAssessments: [
                    ...(user.nutritionAssessments || []),
                    newNutritionAssessment
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
                Carbohydrate_Consumption: parseFloat(formData.Carbohydrate_Consumption) || 0,
                Protein_Intake: parseFloat(formData.Protein_Intake) || 0,
                Fat_Intake: parseFloat(formData.Fat_Intake) || 0,
                Regularity_of_Meals: parseFloat(formData.Regularity_of_Meals) || 0,
                Portion_Control: parseFloat(formData.Portion_Control) || 0,
                Caloric_Balance: parseFloat(formData.Caloric_Balance) || 0,
                DiabetesRisk: parseFloat(formData.Diabetic_Risk) || 0,
                Sugar_Consumption: parseFloat(formData.Sugar_Consumption) || 0
            };
            console.log(formattedData);
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await axios.post(getAiModelUrl(API_CONFIG.AI_MODEL.ENDPOINTS.NUTRITION_RISK_PREDICTION), formattedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const predictionValue = response.data.prediction;
            const featureContributions = response.data.feature_contributions;
            setPrediction(predictionValue);

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

            await updateUserAssessment(assessment);

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

    if (!isOpen) return null;

    return (
        <div className="nutrition-modal-overlay">
            <div className="nutrition-modal-content">
                <button className="modal-close-icon" onClick={onClose}>&times;</button>
                <div className="nutrition-modal-header">
                    <h2>Nutrition Risk Assessment</h2>
                </div>

                <form className="nutrition-modal-form" onSubmit={handleSubmit}>
                    <div className="method-select">
                        <label>Provide daily calories by:</label>
                        <select value={calorieOption} onChange={e => setCalorieOption(e.target.value as any)}>
                            <option value="">Select</option>
                            <option value="manual">Enter manually</option>
                            <option value="food">Select foods (we estimate for you)</option>
                        </select>
                    </div>

                    {calorieOption === 'food' && <FoodEstimator onEstimate={handleFoodEstimate} />}

                    {calorieOption === 'manual' && (
                        <div className="nutrition-modal-mb-3">
                            <label>Daily Calories (kcal)</label>
                            <input
                                className="form-control"
                                type="number"
                                name="Caloric_Balance"
                                value={formData.Caloric_Balance}
                                onChange={handleInputChange}
                                placeholder="e.g., 2000"
                                required
                            />
                        </div>
                    )}

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

export default NutrationRiskModal;
