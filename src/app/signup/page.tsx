"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { generateToken } from '../utils/auth';
import './styles.css';

const SignUp = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Check if email already exists
            const emailCheck = await axios.get(`http://localhost:8000/users?email=${formData.email}`);

            if (emailCheck.data && emailCheck.data.length > 0) {
                setError('Email already exists. Please sign in instead.');
                // Wait for 2 seconds to show the error message
                setTimeout(() => {
                    router.push('/signin');
                }, 2000);
                return;
            }

            // Create user data object
            const userId = Date.now();
            const userData = {
                id: userId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password // In a real app, hash this password
            };

            // Store user in db.json
            await axios.post('http://localhost:8000/users', userData);

            // Generate token
            const token = generateToken({
                userId: userId,
                email: userData.email
            });

            // Store token in db.json
            await axios.post('http://localhost:8000/tokens', {
                userId: userId,
                token,
                createdAt: new Date().toISOString()
            });

            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email
            }));

            router.push('/');
        } catch (error: any) {
            console.error('Signup error:', error);
            setError(error.response?.data?.message || 'An error occurred during signup');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Sign Up</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Sign Up</button>
                </form>
                <p className="auth-link">
                    Already have an account? <a href="/signin">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp; 