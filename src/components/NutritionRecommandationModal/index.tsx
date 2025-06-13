import React from 'react';

type FoodItem = { food: string; grams: number };
type Meals = { breakfast: FoodItem[]; lunch: FoodItem[]; dinner: FoodItem[]; snack: FoodItem[] };
type Recommendation = { day: string; meals: Meals };

type Props = {
    isOpen: boolean;
    onClose: () => void;
    recommendations: Recommendation[];
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

const NutritionRecommandationModal: React.FC<Props> = ({ isOpen, onClose, recommendations }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div
                className="rounded-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
                style={{ background: 'linear-gradient(#0B1117, #102530, #0B1F29)' }}
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">7-Day Nutrition Recommendations</h1>
                    <button onClick={onClose} className="text-3xl font-bold text-white hover:text-red-400">&times;</button>
                </div>
                <div className="flex flex-col gap-8">
                    {recommendations.map((day, idx) => (
                        <div
                            key={idx}
                            className="bg-white/10 rounded-xl p-8 flex flex-col md:flex-row gap-8 items-start shadow-lg min-w-[50px] min-h-[320px]"
                        >
                            <div className="w-full md:w-1/4 flex flex-col items-center justify-center mb-4 md:mb-0">
                                <h2 className="text-2xl font-semibold text-white mb-2">{day.day}</h2>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {Object.entries(day.meals).map(([meal, foods]) => (
                                    <div key={meal} className="bg-white/20 rounded-lg p-4 flex flex-col items-start min-h-[120px] w-full">
                                        <div className="flex items-center mb-2">
                                            {mealIcons[meal]}
                                            <h3 className="ml-2 font-semibold capitalize text-lg text-white">{meal}</h3>
                                        </div>
                                        <ul className="ml-2 list-disc text-white">
                                            {(foods as FoodItem[]).map((item, i) => (
                                                <li key={i} className="text-base">
                                                    <span className="font-semibold">{item.food}</span> - <span className="font-mono">{item.grams}g</span>
                                                </li>
                                            ))}
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
