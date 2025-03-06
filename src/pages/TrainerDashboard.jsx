import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaLayerGroup, FaCheckCircle, FaUpload, FaEye, FaUser } from 'react-icons/fa';

const TrainerDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Add Course',
      icon: <FaBook size={28} />,
      gradient: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      onClick: () => navigate('/trainer/add-course'),
    },
    {
      title: 'Add Batch',
      icon: <FaLayerGroup size={28} />,
      gradient: 'bg-gradient-to-r from-green-500 to-teal-500',
      onClick: () => navigate('/trainer/add-batch'),
    },
    {
      title: 'Manage Attendance',
      icon: <FaCheckCircle size={28} />,
      gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      onClick: () => navigate('/trainer/manage-attendance'),
    },
    {
      title: 'Upload Assignment',
      icon: <FaUpload size={28} />,
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
      onClick: () => navigate('/trainer/upload-assignment'),
    },
    {
      title: 'View Assignments',
      icon: <FaEye size={28} />,
      gradient: 'bg-gradient-to-r from-orange-500 to-yellow-500',
      onClick: () => navigate('/trainer/view-assignments'),
    },
    {
      title: 'Student Summary',
      icon: <FaUser size={28} />,
      gradient: 'bg-gradient-to-r from-red-500 to-orange-500',
      onClick: () => navigate('/trainer/student-summary'),
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-gray-100 to-gray-300 overflow-hidden">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block h-[100px] w-[calc(100%+1.3px)]"
          fill="#fff"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path d="M321.39,56.41C198.49,32.66,99.17,18.21,0,4v116h1200V4C1031.59,32.66,846.79,80,660.8,80,505.55,80,396.06,65.06,321.39,56.41Z" />
        </svg>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block h-[100px] w-[calc(100%+1.3px)]"
          fill="#fff"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path d="M321.39,56.41C198.49,32.66,99.17,18.21,0,4v116h1200V4C1031.59,32.66,846.79,80,660.8,80,505.55,80,396.06,65.06,321.39,56.41Z" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative max-w-6xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
          Trainer Dashboard
        </h1>
        <p className="text-gray-600 mb-8">Manage all your training-related tasks with ease</p>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className={`${card.gradient} rounded-lg shadow-lg p-6 flex flex-col items-center justify-center text-white cursor-pointer transform transition-all hover:scale-105`}
            >
              {card.icon}
              <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
