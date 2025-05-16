"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import HomePage from './HomePage/page';
import RiskAssesment from './RiskAssesment/page';
import UserMenu from "../components/UserMenu";
import RiskScores from './RiskScores/page';
import axios from "axios";
export default function Home() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPredictions, setHasPredictions] = useState(false);

  // Example user data
  const user = {
    avatar: "/avatar.jpg",
    name: "Alexis Sanchez",
    followers: "123K"
  };

  useEffect(() => {
    const checkUserData = async () => {
      const userData = localStorage.getItem('userData');
      const token = localStorage.getItem('token');

      if (!userData || !token) {
        router.push('/signin');
        return;
      }

      try {
        const parsedUserData = JSON.parse(userData);
        const email = parsedUserData.email;
        console.log("email", email);
        const response = await axios.get(`http://localhost:8000/users?email=${email}`);
        const userResponseData = await response.data;
        const hasDiabeticAssessments = userResponseData[0]?.diabeticAssessments?.length > 0;
        const hasNutritionAssessments = userResponseData[0]?.nutritionAssessments?.length > 0;

        setHasPredictions(hasDiabeticAssessments || hasNutritionAssessments);
        setIsLoading(false);
      } catch {
        setHasPredictions(false);
        setIsLoading(false);
      }
    };

    checkUserData();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <button
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          border: "none",
          background: "transparent",
          cursor: "pointer"
        }}
        onClick={() => setShowMenu((s) => !s)}
      >
        <img
          src={user.avatar}
          alt="avatar"
          style={{ width: 48, height: 48, borderRadius: "50%" }}
        />
      </button>
      {showMenu && (
        <UserMenu
          user={user}
          onLogout={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            router.push('/signin');
          }}
        />
      )}
      <HomePage />
      {hasPredictions && <RiskAssesment />}
      {hasPredictions && <RiskScores />}
    </div>
  );
}
