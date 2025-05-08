"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { generateToken } from '../utils/auth';
import './styles.css';

const SignIn = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        try {
            // Find user in db.json
            const response = await axios.get(`http://localhost:8000/users?email=${formData.email}`);
            const user = response.data[0];

            if (!user || user.password !== formData.password) { // In a real app, use proper password comparison
                setError('Invalid email or password');
                return;
            }
            console.log(formData);

            // Generate JWT token
            const token = generateToken({
                userId: user.id,
                email: user.email
            });
            console.log(token);
            // Store token in db.json
            await axios.post('http://localhost:8000/tokens', {
                userId: user.id,
                token,
                createdAt: new Date().toISOString()
            });

            // Store token and user data in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }));

            router.push('/');
        } catch (error: any) {
            console.log(error);
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Sign In</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="auth-button">Sign In</button>
                </form>
                <p className="auth-link">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn; 