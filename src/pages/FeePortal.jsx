import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeePortal = () => {
  const navigate = useNavigate();

  // Function to navigate to a specific route
  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6">Fee Portal</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Submit Student Fees */}
        <div
          className="p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl"
          onClick={() => handleCardClick('/fee-portal/submit-student-fees')}
        >
          <h3 className="text-xl font-semibold text-center mb-4">Submit Student Fees</h3>
          <p className="text-center">Submit fees for a student.</p>
        </div>

        {/* Card 2: View Today Fees Collection */}
        <div
          className="p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl"
          onClick={() => handleCardClick('/fee-portal/view-today-fees')}
        >
          <h3 className="text-xl font-semibold text-center mb-4">View Today's Fees Collection</h3>
          <p className="text-center">View the fees collected today.</p>
        </div>

        {/* Card 3: View Students List */}
        <div
          className="p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl"
          onClick={() => handleCardClick('/fee-portal/view-student-list')}
        >
          <h3 className="text-xl font-semibold text-center mb-4">View Students List</h3>
          <p className="text-center">View the list of students with their fees details.</p>
        </div>

        {/* Card 4: Set Fees for New Registered Student */}
        <div
          className="p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl"
          onClick={() => handleCardClick('/fee-portal/set-fees-for-new-student')}
        >
          <h3 className="text-xl font-semibold text-center mb-4">Set Fees for New Student</h3>
          <p className="text-center">Set the fees for newly registered students.</p>
        </div>
      </div>
    </div>
  );
};

export default FeePortal;
