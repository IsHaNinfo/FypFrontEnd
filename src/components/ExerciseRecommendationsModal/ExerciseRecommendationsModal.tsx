import React from 'react';
import './ExerciseRecommendationsModal.css';

interface Exercise {
    name: string;
    equipment: string | null;
    force: string;
    level: string;
    primaryMuscles: string[];
    secondaryMuscles: string[];
    instructions: string[];
    reps_sets: string;
}

interface Routine {
    role: string;
    exercises: Exercise[];
}

interface Recommendations {
    bmi: number;
    class: string;
    goal: string;
    is_novel: boolean;
    physical_activity_risk: number;
    routine: Routine[];
    sitting_time: number;
}

interface ExerciseRecommendationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    recommendations: Recommendations;
}

const ExerciseRecommendationsModal: React.FC<ExerciseRecommendationsModalProps> = ({
    isOpen,
    onClose,
    recommendations
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="rounded-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Your Personalized Exercise Routine</h1>
                    <button onClick={onClose} className="text-3xl font-bold text-white hover:text-red-400">&times;</button>
                </div>

                <div className="bg-white/10 rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="stat-item">
                            <span className="text-gray-400">Goal</span>
                            <span className="text-xl font-semibold text-white">{recommendations.goal.replace('_', ' ')}</span>
                        </div>
                        <div className="stat-item">
                            <span className="text-gray-400">BMI</span>
                            <span className="text-xl font-semibold text-white">{recommendations.bmi.toFixed(2)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="text-gray-400">Activity Risk</span>
                            <span className="text-xl font-semibold text-white">{(recommendations.physical_activity_risk * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    {recommendations.routine.map((section, index) => (
                        <div key={index} className="bg-white/10 rounded-xl p-8">
                            <h2 className="text-2xl font-semibold text-white mb-6">{section.role}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {section.exercises.map((exercise, exIndex) => (
                                    <div key={exIndex} className="bg-white/20 rounded-lg p-6">
                                        <h3 className="text-xl font-semibold text-white mb-4">{exercise.name}</h3>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-gray-300">
                                                <span className="block text-sm">Level</span>
                                                <span className="font-medium">{exercise.level}</span>
                                            </div>
                                            <div className="text-gray-300">
                                                <span className="block text-sm">Sets & Reps</span>
                                                <span className="font-medium">{exercise.reps_sets}</span>
                                            </div>
                                            {exercise.equipment && (
                                                <div className="text-gray-300 col-span-2">
                                                    <span className="block text-sm">Equipment</span>
                                                    <span className="font-medium">{exercise.equipment}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Primary Muscles</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {exercise.primaryMuscles.map((muscle, i) => (
                                                    <span key={i} className="px-2 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
                                                        {muscle}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {exercise.secondaryMuscles.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-400 mb-2">Secondary Muscles</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {exercise.secondaryMuscles.map((muscle, i) => (
                                                        <span key={i} className="px-2 py-1 bg-green-500/20 rounded-full text-green-300 text-sm">
                                                            {muscle}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Instructions</h4>
                                            <ol className="list-decimal list-inside text-gray-300 space-y-2">
                                                {exercise.instructions.map((instruction, i) => (
                                                    <li key={i} className="text-sm">{instruction}</li>
                                                ))}
                                            </ol>
                                        </div>
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

export default ExerciseRecommendationsModal; 