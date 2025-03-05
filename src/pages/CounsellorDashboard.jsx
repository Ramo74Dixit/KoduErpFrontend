import React from 'react';
import { useNavigate } from 'react-router-dom';

const CounselorDashboard = () => {
  const navigate = useNavigate();

  const goToApproveStudents = () => {
    navigate('/approve-students');
  };

  const goToFeePortal = () => {
    navigate('/fee-portal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg">
            Counselor Dashboard
          </h2>
          <p className="text-lg text-white mt-2">
            Manage student approvals and fee processes seamlessly.
          </p>
        </header>
        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Approve Students Card */}
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl shadow-2xl transform transition duration-300 hover:scale-105 cursor-pointer"
            onClick={goToApproveStudents}
          >
            <h3 className="text-2xl font-semibold text-center mb-4">
              Approve Students
            </h3>
            <p className="text-center">
              Review and approve pending student applications with ease.
            </p>
          </div>
          {/* Fee Portal Card */}
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-8 rounded-xl shadow-2xl transform transition duration-300 hover:scale-105 cursor-pointer"
            onClick={goToFeePortal}
          >
            <h3 className="text-2xl font-semibold text-center mb-4">
              Fee Portal
            </h3>
            <p className="text-center">
              Manage and view student fees in one consolidated place.
            </p>
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

export default CounselorDashboard;
