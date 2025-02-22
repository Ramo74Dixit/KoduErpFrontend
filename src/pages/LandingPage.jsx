// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate instead of useHistory

const LandingPage = () => {
  const navigate = useNavigate();  // Use navigate for routing

  const handleExploreClick = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
      <h1 className="text-5xl font-extrabold leading-tight mb-6">Welcome to Kodu ERP</h1>
      <p className="text-xl mb-6">
        An all-in-one ERP platform to manage your courses, students, trainers, and more!
      </p>
      <button
        onClick={handleExploreClick}
        className="bg-white text-blue-600 px-6 py-3 rounded-full text-xl font-bold hover:bg-gray-200 transition duration-300"
      >
        Explore Now
      </button>
    </div>
  );
};

export default LandingPage;
