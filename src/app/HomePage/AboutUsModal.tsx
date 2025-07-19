import React from 'react';
import './AboutUsModal.css';

interface AboutUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="aboutus-overlay">
            <div className="aboutus-modal">
                <button className="aboutus-close-btn" onClick={onClose}>&times;</button>
                <div className="aboutus-content-row">
                    {/* Left Column */}
                    <div className="aboutus-left">
                        <h2 className="aboutus-headline">
                            It's not about where or when you work. It's about how you get it done.
                        </h2>
                        <p className="aboutus-description">
                            In a flexibility-first world, great work can happen anywhere. At Tech Tonic, we deliver innovative tech solutions, specializing in web and mobile app development. With React, Node.js, AWS, and machine learning, our team ensures excellence, scalability, and client success.
                        </p>
                        <h3 className="aboutus-section-title">Product Capabilities</h3>
                        <p className="aboutus-section-desc">
                            Our product helps office workers (aged 20-50) predict their diabetic risk using lifestyle and health data—analyzing nutrition, physical activity, and mental well-being for actionable recommendations.
                        </p>
                        <h3 className="aboutus-section-title">Specialties</h3>
                        <ul className="aboutus-list">
                            <li>Seamless User Experience</li>
                            <li>High Performance & Scalability</li>
                            <li>Robust Security Features</li>
                            <li>Innovative Design and Functionality</li>
                            <li>Machine Learning Methods:
                                <ul className="aboutus-list aboutus-ml-list">
                                    <li>Random Forest Classifier</li>
                                    <li>Graph Neural Networks (GNN)</li>
                                    <li>Natural Language Processing (NLP)</li>
                                    <li>Knowledge Graph-based Recommendation</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    {/* Right Column */}
                    <div className="aboutus-right">
                        <div className="aboutus-img-container">
                            <img
                                src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=450&h=450&q=80"
                                alt="Team at work"
                                className="aboutus-img"
                            />
                            <div className="aboutus-yellow-bar"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsModal;
