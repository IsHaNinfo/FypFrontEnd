"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';
import UserMenu from '../../components/UserMenu/index';
import DiabeticRiskModal from '../../components/DiabeticRiskModal/DiabeticRiskModal';
const HomePage = () => {

    const user = {
        avatar: "/images/avatar.png", // Replace with actual path
        name: "Alexis Sanchez",
        followers: "123K"
    };
    const router = useRouter();
    const [userData, setUserData] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const guidelines = [
        "Maintain a balanced diet with low sugar intake.",
        "Exercise regularly to manage blood sugar levels.",
        "Monitor your blood glucose levels daily.",
        "Stay hydrated and avoid sugary drinks.",
        "Consult your doctor for personalized advice.",
    ];

    const images = [
        "/images/diet.jpg",
        "/images/exercise.jpg",
        "/images/mental.jpg",
        "/images/hydration.jpg",
        "/images/diabetic.jpg",
    ];

    const [currentGuideline, setCurrentGuideline] = useState(0);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }

        const interval = setInterval(() => {
            setCurrentGuideline((prev) => (prev + 1) % guidelines.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [guidelines.length]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        router.push('/signin');
    };


    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>

            <button
                style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    zIndex: 2000,
                }}
                onClick={() => setShowMenu((s) => !s)}
                aria-label="Open user menu"
            >

            </button>
            {showMenu && userData && (
                <div style={{ position: "fixed", top: 80, right: 20, zIndex: 2100 }}>
                    <UserMenu
                        user={{
                            // Remove avatar here if you don't want to show it in the menu
                            name: userData.firstName + " " + userData.lastName,
                        }}
                        onLogout={handleLogout}
                    />
                </div>
            )}
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
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
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
                        {/* Navigation links can be added here */}
                    </div>
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
                        height: 'calc(100vh - 80px)',
                        textAlign: 'center',
                    }}
                >
                    <h2
                        style={{
                            fontSize: '55px',
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
            </div>
            {/* Avatar button always on top */}
            <button
                style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    zIndex: 2000,
                }}
                onClick={() => setShowMenu((s) => !s)}
                aria-label="Open user menu"
            >
                <img
                    src={user.avatar}
                    alt="avatar"
                    style={{ width: 48, height: 48, borderRadius: "50%" }}
                />
            </button>
            {showMenu && userData && (
                <div style={{ position: "fixed", top: 80, right: 20, zIndex: 2100 }}>
                    <UserMenu
                        user={{
                            avatar: user.avatar,
                            name: userData.firstName + " " + userData.lastName,
                            followers: user.followers
                        }}
                        onLogout={handleLogout}
                    />
                </div>
            )}

            <DiabeticRiskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default HomePage;