import React, { useState, useEffect } from 'react';
import { Flat } from "@alptugidin/react-circular-progress-bar";
import API_CONFIG, { getDatabaseUrl, getAiModelUrl } from '../../services/api';
import axios from 'axios';

const RiskScores = () => {
    const [nutritionScore, setNutritionScore] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) return;

                const { email } = JSON.parse(userData);
                const response = await axios.get(getDatabaseUrl(API_CONFIG.DATABASE.ENDPOINTS.USER_BY_EMAIL(email)));;
                const userResponseData = response.data;

                if (userResponseData && userResponseData[0]?.nutritionAssessments?.length > 0) {
                    // Get the latest nutrition assessment
                    const latestAssessment = userResponseData[0].nutritionAssessments[userResponseData[0].nutritionAssessments.length - 1];
                    const score = latestAssessment.nutritionRiskPrediction[0];
                    console.log("score", score);
                    setNutritionScore(Math.round(score));
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);
    return (
        <div style={{
            padding: '20px',
            background: 'linear-gradient(#0B1117, #102530, #0B1F29)',
            minHeight: '100vh'
        }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '30px',
                color: 'white',
                fontSize: '2rem'
            }}>
                Personal Diabetic Risk Scores
            </h1>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '30px',
                padding: '0 20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Diabetes Risk Score Card */}
                <div style={{
                    flex: 1,
                    maxWidth: '300px',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #2d3748',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        color: '#ff5722',
                        marginBottom: '20px',
                        fontSize: '1.2rem'
                    }}>Nutrition Risk Score</h2>
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
                    <button style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '20px',
                        backgroundColor: '#ff5722',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e64a19'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff5722'}>
                        View Recommendations
                    </button>
                </div>

                {/* Nutrition Risk Score Card */}
                <div style={{
                    flex: 1,
                    maxWidth: '300px',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #2d3748',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        color: '#4CAF50',
                        marginBottom: '20px',
                        fontSize: '1.2rem'
                    }}>Physical Activity Risk Score</h2>
                    <Flat
                        progress={60}
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
                    <button style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#388E3C'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}>
                        View Recommendations
                    </button>
                </div>

                {/* Overall Health Score Card */}
                <div style={{
                    flex: 1,
                    maxWidth: '300px',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #2d3748',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        color: '#2196F3',
                        marginBottom: '20px',
                        fontSize: '1.2rem'
                    }}>Mental Health Risk Score</h2>
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
                    <button style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '20px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}>
                        View Recommendations
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RiskScores;
