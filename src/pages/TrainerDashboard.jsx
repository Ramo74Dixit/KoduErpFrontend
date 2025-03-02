import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
  const navigate = useNavigate();

  const handleAddCourse = () => {
    navigate('/trainer/add-course');
  };

  const handleAddBatch = () => {
    navigate('/trainer/add-batch');
  };

  const handleManageAttendance = () => {
    navigate('/trainer/manage-attendance');
  };

  const handleUploadAssignment = () => {
    navigate('/trainer/upload-assignment');
  };

  const handleViewAssignments = () => {
    navigate('/trainer/view-assignments');
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="grid grid-cols-3 gap-4">
        <div
          className="p-4 bg-indigo-600 rounded-lg shadow-lg text-white cursor-pointer hover:bg-indigo-700 transition"
          onClick={handleAddCourse}
        >
          <h3 className="text-xl font-semibold">Add Course</h3>
        </div>
        <div
          className="p-4 bg-green-600 rounded-lg shadow-lg text-white cursor-pointer hover:bg-green-700 transition"
          onClick={handleAddBatch}
        >
          <h3 className="text-xl font-semibold">Add Batch</h3>
        </div>
        <div
          className="p-4 bg-blue-600 rounded-lg shadow-lg text-white cursor-pointer hover:bg-blue-700 transition"
          onClick={handleManageAttendance}
        >
          <h3 className="text-xl font-semibold">Manage Attendance</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-4 bg-purple-600 rounded-lg shadow-lg text-white cursor-pointer hover:bg-purple-700 transition"
          onClick={handleUploadAssignment}
        >
          <h3 className="text-xl font-semibold">Upload Assignment</h3>
        </div>
        <div
          className="p-4 bg-orange-600 rounded-lg shadow-lg text-white cursor-pointer hover:bg-orange-700 transition"
          onClick={handleViewAssignments}
        >
          <h3 className="text-xl font-semibold">View Assignments</h3>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
