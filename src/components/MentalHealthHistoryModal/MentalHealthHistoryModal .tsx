import React from "react";
import { mentalRecommendationsMap } from "@/data/mentalRecommendation";

interface MentalAssessment {
  id: string;
  timestamp: string;
  formData: {
    age: string;
    gender: string;
    Perceived_Control: string;
    Stress_Freq_Intensity: string;
    Emotional_Reg: string;
    Physical_Stress: string;
    Cognitive_Stress: string;
    Behavioral_Response: string;
    Work_Stress: string;
    Productivity: string;
    Suicidal_Thoughts: string;
    FreeTime: string;
    image: object;
    Diabetic_Risk: string;
  };
  prediction: {
    DL_Output: string;
    ML_Output: string;
    Scenario: string;
  };
}

interface MentalHealthHistoryModalProps {
  show: boolean;
  onClose: () => void;
  assessments: MentalAssessment[];
}

const MentalHealthHistoryModal: React.FC<MentalHealthHistoryModalProps> = ({
  show,
  onClose,
  assessments,
}) => {
  if (!show) return null;

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to get the color based on the risk level
  const getRiskColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes("low")) return "bg-green-100 text-green-800";
    if (lowerLevel.includes("moderate")) return "bg-blue-100 text-blue-800";
    if (lowerLevel.includes("high")) return "bg-yellow-100 text-yellow-800";
    if (lowerLevel.includes("severe")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Function to get the color based on mood
  const getMoodColor = (mood: string) => {
    const lowerMood = mood.toLowerCase();
    if (lowerMood.includes("stable")) return "bg-green-100 text-green-800";
    if (lowerMood.includes("unstable")) return "bg-red-100 text-red-800";
    if (lowerMood.includes("volatile")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  // Function to format the scenario display
  const formatScenarioDisplay = (mlOutput: string, dlOutput: string) => {
    return `${mlOutput} Stress + ${dlOutput} Mood`;
  };

  // Sort assessments by date (newest first)
  const sortedAssessments = [...assessments].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Mental Health History
          </h1>
          <button
            onClick={onClose}
            className="text-3xl font-bold text-white hover:text-red-400 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="space-y-6">
          {sortedAssessments.map((assessment, index) => {
            const recommendation = mentalRecommendationsMap[assessment.prediction.Scenario] || 
                                 mentalRecommendationsMap["high_stress"];
            
            return (
              <div key={assessment.id} className="bg-white/5 rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h2 className="text-xl font-semibold text-white mb-2 md:mb-0">
                    Assessment #{sortedAssessments.length - index}
                  </h2>
                  <span className="text-sm text-gray-400">
                    {formatDate(assessment.timestamp)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-white/10">
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Stress Level</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${getRiskColor(assessment.prediction.ML_Output)}`}>
                      {assessment.prediction.ML_Output}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/10">
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Mood</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${getMoodColor(assessment.prediction.DL_Output)}`}>
                      {assessment.prediction.DL_Output}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/10">
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Condition</h3>
                    <span className="text-sm text-white">
                      {formatScenarioDisplay(assessment.prediction.ML_Output, assessment.prediction.DL_Output)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-2">Key Stress Indicators</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    <div className="p-2 rounded bg-white/5">
                      <p className="text-xs text-gray-400">Perceived Control</p>
                      <p className="text-white">{assessment.formData.Perceived_Control}/5</p>
                    </div>
                    <div className="p-2 rounded bg-white/5">
                      <p className="text-xs text-gray-400">Stress Frequency</p>
                      <p className="text-white">{assessment.formData.Stress_Freq_Intensity}</p>
                    </div>
                    <div className="p-2 rounded bg-white/5">
                      <p className="text-xs text-gray-400">Work Stress</p>
                      <p className="text-white">{assessment.formData.Work_Stress}/5</p>
                    </div>
                    <div className="p-2 rounded bg-white/5">
                      <p className="text-xs text-gray-400">Suicidal Thoughts</p>
                      <p className="text-white">{assessment.formData.Suicidal_Thoughts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30">
                  <h3 className="text-lg font-medium text-white mb-2">Recommendation Given</h3>
                  <p className="text-white/80">{recommendation.recommendation}</p>
                </div>
              </div>
            );
          })}
        </div>

        {assessments.length > 0 && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">Stress Level Trend</h3>
            <div className="flex items-end h-40 gap-1">
              {sortedAssessments.map((assessment, index) => {
                const level = assessment.prediction.ML_Output.toLowerCase();
                let height = 20;
                if (level.includes("low")) height = 40;
                if (level.includes("moderate")) height = 70;
                if (level.includes("high")) height = 100;
                if (level.includes("severe")) height = 120;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t-sm ${
                        level.includes("low") ? "bg-green-500" :
                        level.includes("moderate") ? "bg-blue-500" :
                        level.includes("high") ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-xs text-gray-400 mt-1">
                      {sortedAssessments.length - index}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Oldest</span>
              <span>Newest</span>
            </div>
          </div>
        )}

        {assessments.length === 0 && (
          <div className="text-center py-8 text-white/70">
            No mental health assessments found
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealthHistoryModal;