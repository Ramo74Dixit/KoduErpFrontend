import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeePortal = () => {
  const navigate = useNavigate();

  // Function to navigate to a specific route
  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white drop-shadow-xl">
            Fee Portal
          </h2>
          <p className="text-xl text-white mt-4">
            Manage fee submissions, collections, and student fee details in style.
          </p>
        </header>

        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Card 1: Submit Student Fees */}
          <div
            className="relative group cursor-pointer"
            onClick={() => handleCardClick('/fee-portal/submit-student-fees')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-xl p-8 shadow-2xl transform transition duration-500 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Submit Student Fees
              </h3>
              <p className="text-gray-600">
                Submit fees for a student seamlessly.
              </p>
            </div>
          </div>

          {/* Card 2: View Today's Fees Collection */}
          <div
            className="relative group cursor-pointer"
            onClick={() => handleCardClick('/fee-portal/view-today-fees')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-xl p-8 shadow-2xl transform transition duration-500 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                View Today's Fees
              </h3>
              <p className="text-gray-600">
                Track fee collections for the current day.
              </p>
            </div>
          </div>

          {/* Card 3: View Students List */}
          <div
            className="relative group cursor-pointer"
            onClick={() => handleCardClick('/fee-portal/view-student-list')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-xl p-8 shadow-2xl transform transition duration-500 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                View Students List
              </h3>
              <p className="text-gray-600">
                Access detailed fee info for all students.
              </p>
            </div>
          </div>

          {/* Card 4: Set Fees for New Student */}
          <div
            className="relative group cursor-pointer"
            onClick={() => handleCardClick('/fee-portal/set-fees-for-new-student')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white rounded-xl p-8 shadow-2xl transform transition duration-500 group-hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Set Fees for New Student
              </h3>
              <p className="text-gray-600">
                Establish fee structure for newly registered students.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-white text-sm">
            &copy; {new Date().getFullYear()} Kodu ERP. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FeePortal;
