import React from 'react';

type FoodItem = {
    food: string;
    grams: number;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
    glycemic_index: number;
    estimated_weight_g: number;
    contribution: { diabetes_reduction: number; nutrition_reduction: number; };
};

type Meals = { breakfast: FoodItem[]; lunch: FoodItem[]; dinner: FoodItem[]; snack: FoodItem[] };
type Recommendation = { day: string; meals: Meals };

type Summary = {
    final_risks: {
        estimated_diabetes_risk: number;
        estimated_nutrition_risk: number;
    };
    initial_risks: {
        diabetes_risk: number;
        nutrition_risk: number;
    };
    total_contributions: {
        diabetes_risk_reduced_by: number;
        nutrition_risk_reduced_by: number;
    };
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    recommendations: Recommendation[];
    summary: Summary;
};

const mealIcons: Record<string, React.ReactNode> = {
    breakfast: (
        <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 0a7 7 0 017 7c0 3.866-3.134 7-7 7s-7-3.134-7-7a7 7 0 017-7zm0 0v2m0 0a5 5 0 015 5c0 2.761-2.239 5-5 5s-5-2.239-5-5a5 5 0 015-5z" /></svg>
    ),
    lunch: (
        <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
    ),
    dinner: (
        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" /></svg>
    ),
    snack: (
        <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" /><circle cx="12" cy="12" r="4" fill="currentColor" /></svg>
    ),
};

const NutritionRecommandationModal: React.FC<Props> = ({ isOpen, onClose, recommendations, summary }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="rounded-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">7-Day Nutrition Recommendations</h1>
                    <button onClick={onClose} className="text-3xl font-bold text-white hover:text-red-400">&times;</button>
                </div>
                <div className="flex flex-col gap-8">
                    {recommendations.map((day, idx) => (
                        <div
                            key={idx}
                            className="bg-white/10 rounded-xl p-8 flex flex-col md:flex-row gap-8 items-start shadow-lg"
                        >
                            <div className="w-full md:w-1/4 flex flex-col items-center justify-center mb-4 md:mb-0">
                                <h2 className="text-2xl font-semibold text-white mb-2">{day.day}</h2>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {Object.entries(day.meals).map(([meal, foods]) => (
                                    <div key={meal} className="bg-white/20 rounded-lg p-4 flex flex-col items-start w-full">
                                        <div className="flex items-center mb-2">
                                            {mealIcons[meal]}
                                            <h3 className="ml-2 font-semibold capitalize text-lg text-white">{meal}</h3>
                                        </div>
                                        <ul className="ml-2 list-disc text-white">
                                            {(foods as FoodItem[]).map((item, i) => (
                                                <li key={i} className="text-base">
                                                    <span className="font-semibold">{item.food}</span><span className="font-mono">({item.estimated_weight_g}g)</span>
                                                    <div className="text-sm mt-1">
                                                        <span>Calories: {item.calories.toFixed(2)}</span>,
                                                        <span> Carbs: {item.carbs}g</span>,
                                                        <span> Fat: {item.fat}g</span>,
                                                        <span> Protein: {item.protein}g</span>,
                                                        <span> Glycemic Index: {item.glycemic_index}</span>
                                                    </div>
                                                    {/*
                                                    <div className="text-sm mt-1">
                                                        <span>Diabetes Reduction: {item.contribution.diabetes_reduction}</span>,
                                                        <span> Nutrition Reduction: {item.contribution.nutrition_reduction}</span>
                                                    </div>
                                                    */}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {/*}
                <div className="mt-8 p-6 bg-white/10 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold text-white mb-4">Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between text-white">
                            <span className="font-semibold">Estimated Diabetes Risk:</span>
                            <span>{(summary.final_risks.estimated_diabetes_risk * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-white">
                            <span className="font-semibold">Estimated Nutrition Risk:</span>
                            <span>{(summary.final_risks.estimated_nutrition_risk * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-white">
                            <span className="font-semibold">Diabetes Risk Reduced By:</span>
                            <span>{(summary.total_contributions.diabetes_risk_reduced_by * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-white">
                            <span className="font-semibold">Nutrition Risk Reduced By:</span>
                            <span>{(summary.total_contributions.nutrition_risk_reduced_by * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                */}
            </div>
        </div>
    );
};

export default NutritionRecommandationModal;
