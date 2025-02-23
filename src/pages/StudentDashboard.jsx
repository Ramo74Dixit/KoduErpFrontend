import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const navigate = useNavigate();  // Initialize useNavigate for navigation

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    // Decode the token to get userId
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
    const userId = decodedToken.userId;  // Ensure the token contains userId

    // Fetch student details using fetch API
    fetch(`https://kodu-erp.onrender.com/api/students/student/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStudent(data.updatedProfile); // Set student data from updatedProfile
        const batchId = data.updatedProfile.batchId; // Extract the batchId from updatedProfile
        fetchAttendanceData(userId, batchId); // Fetch attendance data using studentId and batchId
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
      });
  }, []); // Only runs once when the component mounts

  const fetchAttendanceData = (userId, batchId) => {
    const token = localStorage.getItem('token');

    // Fetch attendance summary data using studentId and batchId
    fetch(`https://kodu-erp.onrender.com/api/attendance/summary/student/${userId}/${batchId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAttendanceData(data); // Set attendance data
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
      });
  };

  // Handle logout by clearing token and redirecting to login page
  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear token from localStorage
    navigate('/login');  // Redirect to login page
  };

  // Handle edit profile by navigating to the edit profile page
  const handleEditProfile = () => {
    navigate('/edit-profile');  // Navigate to the edit profile page
  };

  if (!student || !attendanceData) {
    return <div>Loading...</div>;
  }

  const { totalDays, presentDays, absentDays } = attendanceData;
  const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(2);

  // Pie chart data
  const pieData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [presentDays, absentDays],
        backgroundColor: ['#36A2EB', '#FF5733'],
        hoverBackgroundColor: ['#64b1ff', '#ff7c55'],
      },
    ],
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg flex flex-col gap-8">
        {/* Profile Section */}
        <div className="flex items-center space-x-6 mb-6">
          {/* Student Avatar */}
          <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl">
            {student.name[0].toUpperCase()}
          </div>
          {/* Student Name and Email */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">{student.name}</h2>
            <p className="text-lg text-gray-500">{student.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          {/* Left column: General Information */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Role:</p>
              <p>{student.role}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Approved By:</p>
              <p>{student.approvedBy}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Education:</p>
              <p>{student.education}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Phone Number:</p>
              <p>{student.phoneNumber}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Whatsapp Number:</p>
              <p>{student.whatsappNumber}</p>
            </div>
          </div>

          {/* Right column: Courses */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Enrolled Courses:</p>
              <p>{student.enrolledCourses.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="flex justify-center">
            {/* Adjust the size of the Pie Chart */}
            <div className="w-48 h-48 md:w-64 md:h-64">
              <Pie data={pieData} />
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-lg font-medium">Total Present: {presentDays} days</p>
            <p className="text-lg font-medium">Total Absent: {absentDays} days</p>
            <p className="text-lg font-medium">Attendance Percentage: {attendancePercentage}%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-6 justify-center">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={handleEditProfile}  // Navigate to Edit Profile page
          >
            Edit Profile
          </button>
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            onClick={handleLogout}  // Handle logout functionality
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
