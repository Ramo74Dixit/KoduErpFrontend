import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);

  // For assignment listing
  const [assignmentTitles, setAssignmentTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
   
    // Decode the token to get userId
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;

    // 1. Fetch student profile
    fetch(`https://kodu-erp.onrender.com/api/students/student/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch student data');
        return res.json();
      })
      .then((data) => {
        setStudent(data.updatedProfile);

        // 2. Once we have batchId, fetch attendance
        const batchId = data.updatedProfile.batchId;
        fetchAttendanceData(userId, batchId, token);

        // 3. Fetch assignment titles for this batch
        fetchAssignmentTitles(batchId, token);
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
      });
  }, [navigate]);

  // Attendance fetch
  const fetchAttendanceData = (userId, batchId, token) => {
    fetch(`https://kodu-erp.onrender.com/api/attendance/summary/student/${userId}/${batchId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch attendance data');
        return res.json();
      })
      .then((data) => setAttendanceData(data))
      .catch((error) => console.error('Error fetching attendance data:', error));
  };

  // Fetch assignment titles
  const fetchAssignmentTitles = (batchId, token) => {
    fetch(`https://kodu-erp.onrender.com/api/assignments/batches/${batchId}/assignment-titles`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch assignment titles');
        return res.json();
      })
      .then((titles) => {
        // titles is an array of strings
        setAssignmentTitles(titles);
      })
      .catch((error) => {
        console.error('Error fetching assignment titles:', error);
      });
  };

  // Whenever selectedTitle changes, fetch assignments for that title
  useEffect(() => {
    if (!student || !student.batchId || !selectedTitle) {
      setFilteredAssignments([]);
      return;
    }

    const token = localStorage.getItem('token');
    const batchId = student.batchId;
    const url = new URL(
      `https://kodu-erp.onrender.com/api/assignments/batches/${batchId}/student-assignments`
    );

    // Add ?title= query param if a title is selected
    url.searchParams.append('title', selectedTitle);

    fetch(url.toString(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 404) {
          // Means "No student assignments found"
          return [];
        }
        if (!res.ok) throw new Error('Failed to fetch filtered assignments');
        return res.json();
      })
      .then((data) => {
        setFilteredAssignments(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error fetching filtered assignments:', error);
        setFilteredAssignments([]);
      });
  }, [student, selectedTitle]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Edit profile
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (!student || !attendanceData) {
    return <div>Loading...</div>;
  }

  const { totalDays, presentDays, absentDays } = attendanceData;
  const attendancePercentage = totalDays
    ? ((presentDays / totalDays) * 100).toFixed(2)
    : 0;

  const pieData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [presentDays, absentDays],
        backgroundColor: ['#36A2EB', '#FF5733'],
      },
    ],
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg flex flex-col gap-8">

        {/* Profile Section */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl">
            {student.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">{student.name}</h2>
            <p className="text-lg text-gray-500">{student.email}</p>
          </div>
        </div>

        {/* Student Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
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
              <p className="font-medium text-gray-600">WhatsApp Number:</p>
              <p>{student.whatsappNumber}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Enrolled Courses:</p>
              <p>{student.enrolledCourses.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="flex justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64">
              <Pie data={pieData} />
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-lg font-medium">Total Present: {presentDays}</p>
            <p className="text-lg font-medium">Total Absent: {absentDays}</p>
            <p className="text-lg font-medium">
              Attendance Percentage: {attendancePercentage}%
            </p>
          </div>
        </div>

        {/* Assignment Titles Dropdown */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Select an Assignment Title</h3>
          {assignmentTitles.length > 0 ? (
            <select
              className="border p-2 rounded"
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
            >
              <option value="">-- Select Title --</option>
              {assignmentTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          ) : (
            <p>No assignment titles available for this batch.</p>
          )}
        </div>

        {/* Filtered Assignments */}
        {selectedTitle && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">
              Assignments for: {selectedTitle}
            </h4>
            {filteredAssignments.length > 0 ? (
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment._id}>
                      <td className="px-4 py-2 border">{assignment.title}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => window.open(assignment.fileUrl, '_blank')}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          View Assignment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No assignments found for "{selectedTitle}".</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-6 justify-center">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
