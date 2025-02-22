import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
  const navigate = useNavigate();

  const handleAddCourse = () => {
    navigate('/trainer/add-course'); // Navigate to Add Course page
  };

  const handleAddBatch = () => {
    navigate('/trainer/add-batch'); // Navigate to Add Batch page
  };

  const handleManageAttendance = () => {
    navigate('/trainer/manage-attendance'); // Navigate to Manage Attendance page
  };

  return (
    <div className="flex justify-around flex-wrap gap-4">
      <div
        className="w-1/3 p-4 bg-indigo-600 rounded-lg shadow-lg text-white cursor-pointer hover:bg-indigo-700 transition"
        onClick={handleAddCourse}
      >
        <h3 className="text-xl font-semibold">Add Course</h3>
      </div>

      <div
        className="w-1/3 p-4 bg-green-600 rounded-lg shadow-lg text-white cursor-pointer hover:bg-green-700 transition"
        onClick={handleAddBatch}
      >
        <h3 className="text-xl font-semibold">Add Batch</h3>
      </div>

      <div
        className="w-1/3 p-4 bg-blue-600 rounded-lg shadow-lg text-white cursor-pointer hover:bg-blue-700 transition"
        onClick={handleManageAttendance}
      >
        <h3 className="text-xl font-semibold">Manage Attendance</h3>
      </div>
    </div>
  );
};

export default TrainerDashboard;
