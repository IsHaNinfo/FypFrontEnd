"use client";
import React, { useState, useEffect } from 'react';
import "./header.css";
import DiabeticRiskModal from "@/app/components/DiabeticRiskModal/DiabeticRiskModal";

const Header = () => {
    const guidelines = [
        "Maintain a balanced diet with low sugar intake.",
        "Exercise regularly to manage blood sugar levels.",
        "Monitor your blood glucose levels daily.",
        "Stay hydrated and avoid sugary drinks.",
        "Consult your doctor for personalized advice.",
    ];

    const images = [
        "/images/diet.jpg", // Image for guideline 1
        "/images/exercise.jpg", // Image for guideline 2
        "/images/mental.jpg", // Image for guideline 3
        "/images/hydration.jpg", // Image for guideline 4
        "/images/diabetic.jpg", // Image for guideline 5
    ];

    const [currentGuideline, setCurrentGuideline] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGuideline((prev) => (prev + 1) % guidelines.length);
        }, 3000); // Change guideline every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [guidelines.length]);

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundImage: `url(${images[currentGuideline]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                color: 'white',
            }}
        >
            {/* Overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better readability
                }}
            ></div>

            {/* Navbar */}
            <nav
                style={{
                    position: 'relative',
                    zIndex: 10,
                }}
                className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4"
            >
                <span className="text-white text-2xl font-bold">DRS</span>
                <div className="flex space-x-2 bg-white/80 rounded-full px-2 py-1 backdrop-blur-md shadow-md">

                    {/*<a href="#" className="px-4 py-2 text-gray-800 font-medium rounded-full hover:bg-green-100 transition">
                        Recommendations
                    </a>
                    <a href="#" className="px-4 py-2 text-gray-800 font-medium rounded-full hover:bg-green-100 transition">
                        Guidelines
                    </a>*/}
                </div>
                <button className="ml-4 border border-white text-white px-5 py-2 rounded-full hover:bg-white/20 transition font-medium">
                    Contact Us
                </button>
            </nav>

            {/* Hero Section */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 80px)', // Full height minus navbar
                    textAlign: 'center',
                }}
            >
                <h2
                    style={{
                        fontSize: '55px', // Increase font size
                        fontWeight: 'bold',
                        animation: 'fadeIn 1s ease-in-out',
                        marginBottom: '20px',
                    }}
                >
                    {guidelines[currentGuideline]}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {guidelines.map((_, index) => (
                        <span
                            key={index}
                            onClick={() => setCurrentGuideline(index)}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: currentGuideline === index ? 'white' : 'gray',
                                cursor: 'pointer',
                            }}
                        ></span>
                    ))}
                </div>
                <button
                    className="diabetic-btn"
                    onClick={() => setIsModalOpen(true)} // Open the modal on button click
                >
                    Check Your Diabetic Risk
                </button>
            </div>
            <DiabeticRiskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                /> 
        </div>
    );
};

export default Header;