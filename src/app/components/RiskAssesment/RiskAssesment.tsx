"use client";
import React from "react";
import { Flat } from "@alptugidin/react-circular-progress-bar";
import "./riskassesment.css"; // Import the external CSS file

const RiskAssesment = () => {
    const percentage = 80; // Example percentage

    return (
        <div className="risk-assessment-container">
            {/* Left Side: Diagnostic Information */}
            <div className="diagnostic-info">
                <div className="diagnostic-card">
                    <h2 className="diagnostic-percentage">98%</h2>
                    <p className="diagnostic-text">Diagnostic Accuracy</p>
                </div>
                <div className="diagnostic-card">
                    <h2 className="diagnostic-percentage">5 Minute</h2>
                    <p className="diagnostic-text">To Get a Result</p>
                </div>
                <div className="diagnostic-card image-card">
                    <h2 className="diagnostic-percentage">98%</h2>
                    <p className="diagnostic-text">Uniqueness of Recommendations</p>
                </div>
                <div className="diagnostic-card ">
                    <h2 className="diagnostic-percentage">90%</h2>
                    <p className="diagnostic-text">Type 2 Diabetes Cases</p>
                </div>
                <div className="diagnostic-card ">
                    <h2 className="diagnostic-percentage">18.3%</h2>
                    <p className="diagnostic-text">
                        Adults in Sri Lanka with Diabetes
                    </p>
                </div>
                <div className="diagnostic-card">
                    <h2 className="diagnostic-percentage">40–50%</h2>
                    <p className="diagnostic-text">Undiagnosed Diabetic Cases</p>
                </div>
            </div>


            {/* Right Side: Diabetic Risk Assessment */}
            <div className="risk-assessment-content">
                {/* Title */}
                <h2 className="risk-title">Diabetic Risk Score</h2>
                {/* Circular Progress Bar */}
                <Flat
                    progress={percentage}
                    range={{ from: 0, to: 100 }}
                    sign={{ value: "%", position: "end" }}
                    showMiniCircle={false}
                    showValue={true}
                    sx={{
                        strokeColor: "#ff5722", // Purple progress bar color
                        barWidth: 10, // Increase bar width
                        bgStrokeColor: "#2d3748", // Dark grey background circle
                        bgColor: { value: "#000000", transparency: "20" },
                        shape: "full",
                        strokeLinecap: "round",
                        valueSize: 20, // Increase value size
                        valueWeight: "bold",
                        valueColor: "#ff5722", // White value color
                        valueFamily: "Trebuchet MS",
                        textSize: 16,
                        textWeight: "bold",
                        textColor: "#ff5722", // White text color
                        textFamily: "Trebuchet MS",
                        loadingTime: 1000,
                        miniCircleColor: "#a78bfa",
                        miniCircleSize: 5,
                        valueAnimation: true,
                        intersectionEnabled: true,
                    }}

                />
                {/* Description */}
                <p className="risk-description">
                    Your current diabetic risk score is calculated based on your health data.
                </p>

                {/* Buttons */}
                <div className="risk-buttons-container">
                    <h3 className="risk-buttons-title">Select a Risk Category</h3>
                    <div className="risk-buttons">
                        <button className="risk-button nutrition-risk">Nutrition Risk</button>
                        <button className="risk-button physical-activity-risk">Physical Activity Risk</button>
                        <button className="risk-button mental-risk">Mental Risk</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskAssesment;