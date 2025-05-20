"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';
import UserMenu from '../../components/UserMenu/index';
import DiabeticRiskModal from '../../components/DiabeticRiskModal/DiabeticRiskModal';
import Link from 'next/link';

const HomePage = () => {

    const [avatarUrl, setAvatarUrl] = useState("https://avatar.iran.liara.run/public");
    const router = useRouter();
    const [userData, setUserData] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        }, 20000);

        return () => clearInterval(interval);
    }, [guidelines.length]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menuContainer = document.querySelector('.user-menu-container');
            const avatarButton = document.querySelector('.avatar-button');

            if (showMenu &&
                menuContainer &&
                avatarButton &&
                !menuContainer.contains(event.target as Node) &&
                !avatarButton.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    useEffect(() => {
        // Check if we already have a stored avatar
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar) {
            setAvatarUrl(storedAvatar);
        } else {
            // If no stored avatar, generate and store a new one
            localStorage.setItem('userAvatar', avatarUrl);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        router.push('/signin');
    };

    const handlePredictionComplete = (prediction: number) => {
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('predictionUpdated'));
    };

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <div
                className="hero-background"
                style={{ backgroundImage: `url(${images[currentGuideline]})` }}
            >
                <div className="hero-overlay"></div>

                <nav className="navbar flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
                    <span className="text-white text-2xl font-bold">DRS</span>
                    <div className="flex space-x-2 bg-white/80 rounded-full px-2 py-1 backdrop-blur-md shadow-md">

                        <a href="#" className="px-4 py-2 text-gray-800 font-medium rounded-full hover:bg-green-100 transition">
                            About Us
                        </a>
                        <a href="#" className="px-4 py-2 text-gray-800 font-medium rounded-full hover:bg-green-100 transition">
                            Blogs
                        </a>
                    </div>

                </nav>

                <div className="hero-section">
                    <h2 className="hero-title">
                        {guidelines[currentGuideline]}
                    </h2>
                    <div className="hero-dots">
                        {guidelines.map((_, index) => (
                            <span
                                key={index}
                                onClick={() => setCurrentGuideline(index)}
                                className={`hero-dot ${currentGuideline === index ? 'active' : ''}`}
                            ></span>
                        ))}
                    </div>
                    <button
                        className="diabetic-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Check Your Diabetic Risk
                    </button>
                </div>
            </div>

            <button
                className="avatar-button"
                onClick={() => setShowMenu((s) => !s)}
                aria-label="Open user menu"
            >
                <img
                    src={avatarUrl}
                    alt="avatar"
                    className="avatar-image"
                />
            </button>
            {showMenu && userData && (
                <div className="user-menu-container">
                    <UserMenu
                        user={{
                            avatar: avatarUrl,
                            name: userData.firstName + " " + userData.lastName,
                            followers: "123K"
                        }}
                        onLogout={handleLogout}
                    />
                </div>
            )}

            <DiabeticRiskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPredictionComplete={handlePredictionComplete}
            />
        </div>
    );
};

export default HomePage;