import React from 'react';

type FoodItem = {
    food_id: string;
    food_item: string;
    portion_g: number;
    nutrients: {
        calories: number;
        carbs: number;
        fat: number;
        protein: number;
        glycemic_index: number;
    };
};

type Meals = { [key: string]: FoodItem[] };
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

const mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const NutritionRecommandationModal: React.FC<Props> = ({ isOpen, onClose, recommendations, summary }) => {
    if (!isOpen) return null;

    // Group meals by day
    const groupedRecommendations = recommendations.reduce((acc, recommendation) => {
        const { day, meals } = recommendation;
        if (!acc[day]) {
            acc[day] = [];
        }
        Object.entries(meals).forEach(([mealType, mealItems]) => {
            mealItems.forEach((item) => {
                acc[day].push({ mealType, ...item });
            });
        });
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="rounded-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">7-Day Nutrition Recommendations</h1>
                    <button onClick={onClose} className="text-3xl font-bold text-white hover:text-red-400">&times;</button>
                </div>
                <div className="flex flex-col gap-8">
                    {Object.entries(groupedRecommendations).map(([day, meals], idx) => (
                        <div
                            key={idx}
                            className="bg-white/10 rounded-xl p-8 flex flex-col gap-8 items-start shadow-lg"
                        >
                            <h2 className="text-2xl font-semibold text-white mb-2">{day}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {meals.map((item, i) => (
                                    <div key={i} className="bg-white/20 rounded-lg p-4 flex flex-col items-start w-full">
                                        <div className="flex items-center mb-2">
                                            {mealIcons[item.mealType.toLowerCase()]}
                                            <h3 className="ml-2 font-semibold capitalize text-lg text-white">{item.mealType}</h3>
                                        </div>
                                        <ul className="ml-2 list-disc text-white">
                                            <li className="text-base">
                                                <span className="font-semibold">{item.food_item}</span><span className="font-mono">({item.portion_g}g)</span>
                                                <div className="text-sm mt-1">
                                                    <span>Calories: {typeof item.nutrients?.calories === 'number' ? item.nutrients.calories.toFixed(2) : 'N/A'}</span>,
                                                    <span> Carbs: {item.nutrients?.carbs || 'N/A'}g</span>,
                                                    <span> Fat: {item.nutrients?.fat || 'N/A'}g</span>,
                                                    <span> Protein: {item.nutrients?.protein || 'N/A'}g</span>,
                                                    <span> Glycemic Index: {item.nutrients?.glycemic_index || 'N/A'}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NutritionRecommandationModal;
