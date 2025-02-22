import React from 'react';
import { useNavigate } from 'react-router-dom';

const CounselorDashboard = () => {
  const navigate = useNavigate();

  const goToApproveStudents = () => {
    navigate('/approve-students');  // Navigate to approve students page
  };

  const goToFeePortal = () => {
    navigate('/fee-portal');  // Navigate to fee portal page
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6">Counselor Dashboard</h2>

      {/* Card for Approve Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl"
          onClick={goToApproveStudents}
        >
          <h3 className="text-xl font-bold text-center">Approve Students</h3>
          <p className="mt-2 text-center text-gray-600">
            Approve pending students for the platform.
          </p>
        </div>

        {/* Card for Fee Portal */}
        <div
          className="p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl"
          onClick={goToFeePortal}
        >
          <h3 className="text-xl font-bold text-center">Fee Portal</h3>
          <p className="mt-2 text-center text-gray-600">
            Manage and view student fees here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CounselorDashboard;
