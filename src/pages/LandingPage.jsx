// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white
                    bg-gradient-to-br from-[#0f2027] to-[#2c5364]">
      {/* Bottom Wave (blends with the background) */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#2c5364"
            fillOpacity="1"
            d="M0,224L80,213.3C160,203,320,181,480,192C640,203,800,245,960,256C1120,267,1280,245,1360,234.7L1440,224V320H0V224Z"
          ></path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xl px-4">
        {/* Glassmorphism Card */}
        <div className="mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 md:p-12 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center drop-shadow-md">
            Welcome to Kodu ERP
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 text-center">
            An all-in-one ERP platform to manage your courses, students, trainers, and more!
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleExploreClick}
              className="px-6 py-3 bg-teal-500 text-white font-bold rounded-full shadow-xl
                         hover:bg-teal-400 transition-transform duration-300
                         transform hover:-translate-y-1 active:translate-y-0"
            >
              Explore Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
