"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import HomePage from './HomePage/page';
import RiskAssesment from './RiskAssesment/page';
import UserMenu from "../components/UserMenu";

export default function Home() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  // Example user data
  const user = {
    avatar: "/avatar.jpg", // Replace with actual path
    name: "Alexis Sanchez",
    followers: "123K"
  };

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
            // redirect or update UI as needed
          }}
        />
      )}
      <HomePage />
      <RiskAssesment />
    </div>
  );
}
