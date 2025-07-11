import React, { useState, useEffect } from "react";
import { Flat } from "@alptugidin/react-circular-progress-bar";
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from "../../services/api";
import axios from "axios";
import "./styles.css";
<<<<<<< HEAD
import MentalRecommandationModal from "@/components/MentalRecommandationModal/MentalRecommandationModal";

export interface MentalRiskData {
  DL_Output: string;
  ML_Output: string;
  Scenario: string;
}

const RiskScores = () => {
  const [nutritionScore, setNutritionScore] = useState<number>(0);
  const [physicalScore, setPhysicalScore] = useState<number>(0);
  const [mentalRiskData, setMentalRiskData] = useState<MentalRiskData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showMentalModal, setShowMentalModal] = useState(false);
=======
import NutritionRecommandationModal from '../../components/NutritionRecommandationModal';
import FeatureContributionsModal from '../../components/NutritionFeatureContributionsModal/NutritionFeatureContributionsModal';
import PhysicalRiskFeatureContributionsModal from '../../components/PhysicalRiskFeatureContributionsModal/PhysicalRiskFeatureContributionsModal';
import AddSuggestionModal from '../../components/AddSuggestionModal/AddSuggestionModal';
import ExerciseRecommendationsModal from '../../components/ExerciseRecommendationsModal/ExerciseRecommendationsModal';



const RiskScores = () => {
    const [nutritionScore, setNutritionScore] = useState<number>(0);
    const [physicalScore, setPhysicalScore] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showNutritionModal, setShowNutritionModal] = useState(false);
    const [nutritionRecommendations, setNutritionRecommendations] = useState<any>(null);
    const [showFeatureContributions, setShowFeatureContributions] = useState(false);
    const [featureContributions, setFeatureContributions] = useState(null);
    const [showPhysicalFeatureContributions, setShowPhysicalFeatureContributions] = useState(false);
    const [physicalFeatureContributions, setPhysicalFeatureContributions] = useState(null);
    const [showAddSuggestionModal, setShowAddSuggestionModal] = useState(false);
    const [suggestionType, setSuggestionType] = useState<'nutrition' | 'physical' | 'mental'>('nutrition');
    const [showPreviousRecommendations, setShowPreviousRecommendations] = useState(false);
    const [previousRecommendations, setPreviousRecommendations] = useState<any>(null);
    const [nutritionSummary, setNutritionSummary] = useState<any>(null);
    const [loading, setLoading] = useState(false);

>>>>>>> main

  // Enhanced color mapping for mental risk levels
  const getMentalRiskColor = (level: string | undefined) => {
    if (!level) return "#2196F3"; // Default blue

    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes("low")) return "#4CAF50"; // Green
    if (lowerLevel.includes("moderate")) return "#2196F3"; // Blue
    if (lowerLevel.includes("high")) return "#FFA500"; // Orange
    if (lowerLevel.includes("severe")) return "#f44336"; // Red
    return "#2196F3"; // Default blue
  };

<<<<<<< HEAD
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("userData");
        if (!userData) return;

        const { email } = JSON.parse(userData);
        const response = await fetch(getDatabaseUrl(`/users?email=${email}`));
        const userResponseData = await response.json();

        if (
          userResponseData &&
          userResponseData[0]?.nutritionAssessments?.length > 0
        ) {
          const latestAssessment =
            userResponseData[0].nutritionAssessments[
              userResponseData[0].nutritionAssessments.length - 1
            ];
          const score = latestAssessment.nutritionRiskPrediction[0];
          setNutritionScore(Math.round(score));
        }

        if (
          userResponseData &&
          userResponseData[0]?.physicalAssessments?.length > 0
        ) {
          const latestPhysicalAssessment =
            userResponseData[0].physicalAssessments[
              userResponseData[0].physicalAssessments.length - 1
            ];
          const physicalScore =
            latestPhysicalAssessment.physicalRiskPrediction[0];
          setPhysicalScore(Math.round(physicalScore));
        }
=======
                if (userResponseData && userResponseData[0]?.nutritionAssessments?.length > 0) {
                    const latestAssessment = userResponseData[0].nutritionAssessments[userResponseData[0].nutritionAssessments.length - 1];
                    const score = latestAssessment.nutritionRiskPrediction[0];
                    setNutritionScore(Math.round(score));

                    // Set feature contributions if available
                    if (latestAssessment.feature_contributions) {
                        setFeatureContributions(latestAssessment.feature_contributions);
                    }
                }

                // Get the latest physical assessment
                if (userResponseData && userResponseData[0]?.physicalAssessments?.length > 0) {
                    const latestPhysicalAssessment = userResponseData[0].physicalAssessments[userResponseData[0].physicalAssessments.length - 1];
                    const physicalScore = latestPhysicalAssessment.physicalRiskPrediction[0];
                    setPhysicalScore(Math.round(physicalScore));

                    // Set physical feature contributions if available
                    if (latestPhysicalAssessment.feature_contributions) {
                        setPhysicalFeatureContributions(latestPhysicalAssessment.feature_contributions);
                    }
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            }
        };

        fetchUserData();

        // Listen for nutrition assessment updates
        const handleNutritionUpdate = (event: CustomEvent) => {
            const { prediction, featureContributions } = event.detail;
            setNutritionScore(Math.round(prediction));
            setFeatureContributions(featureContributions);
        };

        // Listen for physical assessment updates
        const handlePhysicalUpdate = (event: CustomEvent) => {
            const { prediction, featureContributions } = event.detail;
            setPhysicalScore(Math.round(prediction));
            setPhysicalFeatureContributions(featureContributions);
        };

        window.addEventListener('nutritionAssessmentUpdated', handleNutritionUpdate as EventListener);
        window.addEventListener('physicalAssessmentUpdated', handlePhysicalUpdate as EventListener);

        return () => {
            window.removeEventListener('nutritionAssessmentUpdated', handleNutritionUpdate as EventListener);
            window.removeEventListener('physicalAssessmentUpdated', handlePhysicalUpdate as EventListener);
        };
    }, []);

    // Add this function to fetch feature contributions
    const fetchFeatureContributions = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    if (user.nutritionAssessments && user.nutritionAssessments.length > 0) {
                        const latestAssessment = user.nutritionAssessments[user.nutritionAssessments.length - 1];
                        if (latestAssessment.feature_contributions) {
                            setFeatureContributions(latestAssessment.feature_contributions);
                            setShowFeatureContributions(true);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching feature contributions:', error);
        }
    };

    // Add this function to fetch physical feature contributions
    const fetchPhysicalFeatureContributions = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    if (user.physicalAssessments && user.physicalAssessments.length > 0) {
                        const latestAssessment = user.physicalAssessments[user.physicalAssessments.length - 1];
                        if (latestAssessment.feature_contributions) {
                            setPhysicalFeatureContributions(latestAssessment.feature_contributions);
                            setShowPhysicalFeatureContributions(true);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching physical feature contributions:', error);
        }
    };

    const handleAddSuggestion = async (suggestionData: any) => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    const updatedUser = {
                        ...user,
                        suggestions: [
                            ...(user.suggestions || []),
                            {
                                goal: suggestionData.goal,
                                suggestions: suggestionData.suggestions,
                                date: new Date().toISOString()
                            }
                        ]
                    };
                    await axios.put(`http://localhost:8000/users/${user.id}`, updatedUser);
                }
            }
        } catch (error) {
            console.error('Error adding suggestion:', error);
        }
    };

    // Add this function to fetch previous recommendations
    const fetchPreviousRecommendations = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await fetch(getDatabaseUrl(`/users?email=${email}`));
                const userData = await response.json();

                if (userData && userData.length > 0) {
                    const user = userData[0];
                    if (user.physical_activity_recommendations && user.physical_activity_recommendations.length > 0) {
                        // Filter out empty objects and get the latest recommendation
                        const validRecommendations = user.physical_activity_recommendations.filter(
                            (rec: any) => rec.recommendations && Object.keys(rec.recommendations).length > 0
                        );

                        if (validRecommendations.length > 0) {
                            const latestRecommendation = validRecommendations
                                .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

                            setPreviousRecommendations(latestRecommendation.recommendations);
                            setShowPreviousRecommendations(true);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching previous recommendations:', error);
        }
    };

    const handleViewRecommendations = async () => {
        setLoading(true);
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    const latestNutritionAssessment = user.nutritionAssessments[user.nutritionAssessments.length - 1];

                    // Prepare request data using the latest assessment
                    const requestData = {
                        age: parseInt(latestNutritionAssessment.formData.age),
                        gender: parseInt(latestNutritionAssessment.formData.gender),
                        bmi: calculateBMI(latestNutritionAssessment.formData.height, latestNutritionAssessment.formData.weight),
                        diabetes_risk: parseFloat(latestNutritionAssessment.formData.Diabetic_Risk) / 100,
                        nutrition_risk: latestNutritionAssessment.nutritionRiskPrediction[0] / 100,
                        preferences: "Sri Lankan" // Default preference
                    };

                    // Send request to the specified URL
                    const recommendationResponse = await axios.post('http://127.0.0.1:5000/generate_meal_plan', requestData);
                    const recommendationData = recommendationResponse.data;
                    console.log(recommendationData);
                    // Convert updated_meal_plan to an array format
                    const formattedRecommendations = Object.entries(recommendationData.updated_meal_plan).map(([day, meals]) => ({
                        day,
                        meals: Object.entries(meals).reduce((acc, [mealType, mealData]) => {
                            acc[mealType] = Array.isArray(mealData) ? mealData : [mealData];
                            return acc;
                        }, {})
                    }));

                    // Save the recommendation in db.json
                    const updatedUser = {
                        ...user,
                        nutritionRecommendations: [...(user.nutritionRecommendations || []), recommendationData]
                    };
                    await axios.put(`http://localhost:8000/users/${user.id}`, updatedUser);

                    // Set the recommendation data to state
                    setNutritionRecommendations(formattedRecommendations);
                    setNutritionSummary(recommendationData.summary);
                    setShowNutritionModal(true);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleViewPreviousRecommendations = async () => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const { email } = JSON.parse(storedUser);
                const response = await axios.get(`http://localhost:8000/users?email=${email}`);
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];

                    // Get the last saved nutrition recommendation
                    const lastRecommendation = user.nutritionRecommendations?.slice(-1)[0];

                    if (lastRecommendation) {
                        // Convert updated_meal_plan to an array format
                        const formattedRecommendations = Object.entries(lastRecommendation.updated_meal_plan).map(([day, meals]) => ({
                            day,
                            meals: Object.entries(meals).reduce((acc, [mealType, mealData]) => {
                                acc[mealType] = Array.isArray(mealData) ? mealData : [mealData];
                                return acc;
                            }, {})
                        }));

                        // Set the recommendation data to state
                        setNutritionRecommendations(formattedRecommendations);
                        setNutritionSummary(lastRecommendation.summary);
                        setShowNutritionModal(true);
                    } else {
                        alert("No previous recommendations found.");
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching previous recommendations:', error);
        }
    };

    // Helper function to calculate BMI
    const calculateBMI = (height: string, weight: string) => {
        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        return weightInKg / (heightInMeters * heightInMeters);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
>>>>>>> main

        if (
          userResponseData &&
          userResponseData[0]?.mentalAssessments?.length > 0
        ) {
          const latestMentalAssessment =
            userResponseData[0].mentalAssessments[
              userResponseData[0].mentalAssessments.length - 1
            ];
          setMentalRiskData(latestMentalAssessment.prediction);
        }

<<<<<<< HEAD
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  const mentalRiskLevel = mentalRiskData?.ML_Output || "Not Assessed";
  const mentalRiskColor = getMentalRiskColor(mentalRiskData?.ML_Output);
  const scenario = mentalRiskData?.Scenario || "No assessment available";

  return (
    <div className="risk-scores-container">
      <h1 className="risk-scores-title">Personal Diabetic Risk Scores</h1>

      <div className="risk-scores-grid">
        {/* Nutrition Risk Score Card */}
        <div className="risk-score-card">
          <h2 className="risk-score-title nutrition">Nutrition Risk Score</h2>
          <Flat
            progress={nutritionScore}
            range={{ from: 0, to: 100 }}
            sign={{ value: "%", position: "end" }}
            showMiniCircle={false}
            showValue={true}
            sx={{
              strokeColor: "#ff5722",
              barWidth: 8,
              bgStrokeColor: "#2d3748",
              bgColor: { value: "#000000", transparency: "20" },
              shape: "full",
              strokeLinecap: "round",
              valueSize: 18,
              valueWeight: "bold",
              valueColor: "#ff5722",
              valueFamily: "Trebuchet MS",
              textSize: 14,
              textWeight: "bold",
              textColor: "#ff5722",
              textFamily: "Trebuchet MS",
              loadingTime: 1000,
              miniCircleColor: "#a78bfa",
              miniCircleSize: 5,
              valueAnimation: true,
              intersectionEnabled: true,
            }}
          />
          <button className="recommendation-button nutrition">
            View Recommendations
          </button>
=======
            <div className="risk-scores-grid">
                {/* Nutrition Risk Score Card */}
                <div className="risk-score-card">
                    <h2 className="risk-score-title nutrition">Nutrition Risk Score</h2>
                    <Flat
                        progress={nutritionScore}
                        range={{ from: 0, to: 100 }}
                        sign={{ value: "%", position: "end" }}
                        showMiniCircle={false}
                        showValue={true}
                        sx={{
                            strokeColor: "#ff5722",
                            barWidth: 8,
                            bgStrokeColor: "#2d3748",
                            bgColor: { value: "#000000", transparency: "20" },
                            shape: "full",
                            strokeLinecap: "round",
                            valueSize: 18,
                            valueWeight: "bold",
                            valueColor: "#ff5722",
                            valueFamily: "Trebuchet MS",
                            textSize: 14,
                            textWeight: "bold",
                            textColor: "#ff5722",
                            textFamily: "Trebuchet MS",
                            loadingTime: 1000,
                            miniCircleColor: "#a78bfa",
                            miniCircleSize: 5,
                            valueAnimation: true,
                            intersectionEnabled: true,
                        }}
                    />
                    <button
                        className="recommendation-button nutrition"
                        onClick={fetchFeatureContributions}
                    >
                        Feature Contribution
                    </button>
                    <button className="recommendation-button nutrition" onClick={handleViewRecommendations} disabled={loading}>
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            'View Recommendations'
                        )}
                    </button>

                    <button className="recommendation-button nutrition" onClick={handleViewPreviousRecommendations}>
                        Previous Recommendations
                    </button>
                </div>

                {/* Physical Activity Risk Score Card */}
                <div className="risk-score-card">
                    <h2 className="risk-score-title physical">Physical Activity Risk Score</h2>
                    <Flat
                        progress={physicalScore}
                        range={{ from: 0, to: 100 }}
                        sign={{ value: "%", position: "end" }}
                        showMiniCircle={false}
                        showValue={true}
                        sx={{
                            strokeColor: "#4CAF50",
                            barWidth: 8,
                            bgStrokeColor: "#2d3748",
                            bgColor: { value: "#000000", transparency: "20" },
                            shape: "full",
                            strokeLinecap: "round",
                            valueSize: 18,
                            valueWeight: "bold",
                            valueColor: "#4CAF50",
                            valueFamily: "Trebuchet MS",
                            textSize: 14,
                            textWeight: "bold",
                            textColor: "#4CAF50",
                            textFamily: "Trebuchet MS",
                            loadingTime: 1000,
                            miniCircleColor: "#a78bfa",
                            miniCircleSize: 5,
                            valueAnimation: true,
                            intersectionEnabled: true,
                        }}
                    />
                    <button className="recommendation-button physical" onClick={fetchPhysicalFeatureContributions}>
                        Feature Contribution
                    </button>
                    <button className="recommendation-button physical" onClick={() => {
                        setSuggestionType('physical');
                        setShowAddSuggestionModal(true);
                    }}>
                        View Recommendations
                    </button>
                    <button
                        className="recommendation-button physical"
                        onClick={fetchPreviousRecommendations}
                    >
                        Previous Recommendations
                    </button>
                </div>

                {/* Mental Health Risk Score Card */}
                <div className="risk-score-card">
                    <h2 className="risk-score-title mental">Mental Health Risk Score</h2>
                    <Flat
                        progress={85}
                        range={{ from: 0, to: 100 }}
                        sign={{ value: "%", position: "end" }}
                        showMiniCircle={false}
                        showValue={true}
                        sx={{
                            strokeColor: "#2196F3",
                            barWidth: 8,
                            bgStrokeColor: "#2d3748",
                            bgColor: { value: "#000000", transparency: "20" },
                            shape: "full",
                            strokeLinecap: "round",
                            valueSize: 18,
                            valueWeight: "bold",
                            valueColor: "#2196F3",
                            valueFamily: "Trebuchet MS",
                            textSize: 14,
                            textWeight: "bold",
                            textColor: "#2196F3",
                            textFamily: "Trebuchet MS",
                            loadingTime: 1000,
                            miniCircleColor: "#a78bfa",
                            miniCircleSize: 5,
                            valueAnimation: true,
                            intersectionEnabled: true,
                        }}
                    />
                    <button className="recommendation-button mental">
                        View Recommendations
                    </button>
                    <button className="recommendation-button mental">
                        View Recommendations
                    </button>
                </div>
            </div>
            <NutritionRecommandationModal
                isOpen={showNutritionModal}
                onClose={() => setShowNutritionModal(false)}
                recommendations={nutritionRecommendations}
                summary={nutritionSummary}
            />
            <FeatureContributionsModal
                isOpen={showFeatureContributions}
                onClose={() => setShowFeatureContributions(false)}
                contributions={featureContributions}
            />
            <PhysicalRiskFeatureContributionsModal
                isOpen={showPhysicalFeatureContributions}
                onClose={() => setShowPhysicalFeatureContributions(false)}
                contributions={physicalFeatureContributions}
            />
            <AddSuggestionModal
                isOpen={showAddSuggestionModal}
                onClose={() => setShowAddSuggestionModal(false)}
                onSubmit={handleAddSuggestion}
            />
            {showPreviousRecommendations && previousRecommendations && (
                <ExerciseRecommendationsModal
                    isOpen={showPreviousRecommendations}
                    onClose={() => setShowPreviousRecommendations(false)}
                    recommendations={previousRecommendations}
                />
            )}
>>>>>>> main
        </div>

        {/* Physical Activity Risk Score Card */}
        <div className="risk-score-card">
          <h2 className="risk-score-title physical">
            Physical Activity Risk Score
          </h2>
          <Flat
            progress={physicalScore}
            range={{ from: 0, to: 100 }}
            sign={{ value: "%", position: "end" }}
            showMiniCircle={false}
            showValue={true}
            sx={{
              strokeColor: "#4CAF50",
              barWidth: 8,
              bgStrokeColor: "#2d3748",
              bgColor: { value: "#000000", transparency: "20" },
              shape: "full",
              strokeLinecap: "round",
              valueSize: 18,
              valueWeight: "bold",
              valueColor: "#4CAF50",
              valueFamily: "Trebuchet MS",
              textSize: 14,
              textWeight: "bold",
              textColor: "#4CAF50",
              textFamily: "Trebuchet MS",
              loadingTime: 1000,
              miniCircleColor: "#a78bfa",
              miniCircleSize: 5,
              valueAnimation: true,
              intersectionEnabled: true,
            }}
          />
          <button className="recommendation-button physical">
            View Recommendations
          </button>
        </div>

        {/* Mental Health Risk Score Card */}
        <div className="risk-score-card">
          <h2 className="risk-score-title mental">Mental Health Risk</h2>
          <div className="mental-risk-display">
            <div
              className="mental-risk-circle"
              style={{
                border: `20px solid #2196F3`,
                color: mentalRiskColor, 
                backgroundColor: `${mentalRiskColor}20`, 
              }}
            >
              <div className="mental-label">Stress Level</div>
              <div className="mental-value">{mentalRiskLevel}</div>
              <div className="mental-label">Mood</div>
              <div className="mental-value">
                {mentalRiskData?.DL_Output || "N/A"}
              </div>
            </div>
          </div>
          <button
            className="recommendation-button mental"
            onClick={() => setShowMentalModal(true)}
          >
            View Recommendations
          </button>
        </div>
        <MentalRecommandationModal
          show={showMentalModal}
          onClose={() => setShowMentalModal(false)}
          scenario={scenario}
        />
      </div>
    </div>
  );
};

export default RiskScores;
