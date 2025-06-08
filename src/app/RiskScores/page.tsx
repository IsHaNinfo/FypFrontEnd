import React, { useState, useEffect } from "react";
import { Flat } from "@alptugidin/react-circular-progress-bar";
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from "../../services/api";
import axios from "axios";
import "./styles.css";
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
