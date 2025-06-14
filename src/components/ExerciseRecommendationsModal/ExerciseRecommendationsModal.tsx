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
        <div className="exercise-modal-overlay">
            <div className="exercise-modal-content">
                <button className="exercise-modal-close" onClick={onClose}>&times;</button>

                <div className="exercise-modal-header">
                    <h2>Your Personalized Exercise Routine</h2>
                    <div className="exercise-modal-stats">
                        <div className="stat-item">
                            <span className="stat-label">Goal:</span>
                            <span className="stat-value">{recommendations.goal.replace('_', ' ')}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">BMI:</span>
                            <span className="stat-value">{recommendations.bmi.toFixed(2)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Activity Risk:</span>
                            <span className="stat-value">{(recommendations.physical_activity_risk * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div className="exercise-modal-body">
                    {recommendations.routine.map((section, index) => (
                        <div key={index} className="exercise-section">
                            <h3 className="section-title">{section.role}</h3>
                            <div className="exercises-grid">
                                {section.exercises.map((exercise, exIndex) => (
                                    <div key={exIndex} className="exercise-card">
                                        <h4 className="exercise-name">{exercise.name}</h4>
                                        <div className="exercise-details">
                                            <p><strong>Level:</strong> {exercise.level}</p>
                                            <p><strong>Sets & Reps:</strong> {exercise.reps_sets}</p>
                                            {exercise.equipment && (
                                                <p><strong>Equipment:</strong> {exercise.equipment}</p>
                                            )}
                                            <div className="muscle-groups">
                                                <p><strong>Primary Muscles:</strong></p>
                                                <ul>
                                                    {exercise.primaryMuscles.map((muscle, i) => (
                                                        <li key={i}>{muscle}</li>
                                                    ))}
                                                </ul>
                                                {exercise.secondaryMuscles.length > 0 && (
                                                    <>
                                                        <p><strong>Secondary Muscles:</strong></p>
                                                        <ul>
                                                            {exercise.secondaryMuscles.map((muscle, i) => (
                                                                <li key={i}>{muscle}</li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                            <div className="instructions">
                                                <p><strong>Instructions:</strong></p>
                                                <ol>
                                                    {exercise.instructions.map((instruction, i) => (
                                                        <li key={i}>{instruction}</li>
                                                    ))}
                                                </ol>
                                            </div>
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