import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
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

    // Fetch student profile
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
        const batchId = data.updatedProfile.batchId;
        fetchAttendanceData(userId, batchId, token);
        fetchAssignmentTitles(batchId, token);
      })
      .catch((error) => console.error('Error fetching student data:', error));
  }, [navigate]);

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

  const fetchAssignmentTitles = (batchId, token) => {
    fetch(`https://kodu-erp.onrender.com/api/assignments/batches/${batchId}/assignment-titles`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch assignment titles');
        return res.json();
      })
      .then((titles) => setAssignmentTitles(titles))
      .catch((error) => console.error('Error fetching assignment titles:', error));
  };

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
    url.searchParams.append('title', selectedTitle);

    fetch(url.toString(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 404) return [];
        if (!res.ok) throw new Error('Failed to fetch filtered assignments');
        return res.json();
      })
      .then((data) => setFilteredAssignments(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error('Error fetching filtered assignments:', error);
        setFilteredAssignments([]);
      });
  }, [student, selectedTitle]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (!student || !attendanceData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#fc466b] to-[#3f5efb]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
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
        backgroundColor: ['#00c853', '#d50000'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fc466b] to-[#3f5efb] p-4 md:p-6">
      {/* Outer container for the card */}
      <div className="max-w-6xl mx-auto bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl text-white font-bold">Student Dashboard</h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <button
              onClick={handleEditProfile}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 transition rounded text-white font-semibold"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 transition rounded text-white font-semibold"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8 grid gap-8">
          {/* Profile Card */}
          <div className="flex items-center bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mr-4 md:mr-6">
              {student.name[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">{student.name}</h2>
              <p className="text-gray-600">{student.email}</p>
            </div>
          </div>

          {/* Student Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow border">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
                Personal Details
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Role:</span>
                  <span>{student.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Approved By:</span>
                  <span>{student.approvedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Education:</span>
                  <span>{student.education}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Phone:</span>
                  <span>{student.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">WhatsApp:</span>
                  <span>{student.whatsappNumber}</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow border">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
                Courses
              </h3>
              <p className="text-gray-700">
                {student.enrolledCourses && student.enrolledCourses.length > 0
                  ? student.enrolledCourses.join(', ')
                  : 'No courses found.'}
              </p>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow border">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
              Attendance Summary
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-around">
              <div className="w-40 h-40 sm:w-48 sm:h-48 mb-6 md:mb-0">
                <Pie data={pieData} />
              </div>
              <div className="text-center md:text-left space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  Present: <span className="text-green-600">{presentDays}</span>
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  Absent: <span className="text-red-600">{absentDays}</span>
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  Attendance:{' '}
                  <span
                    className={
                      attendancePercentage > 75
                        ? 'text-green-600'
                        : attendancePercentage > 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }
                  >
                    {attendancePercentage}%
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Section */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow border">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
              Assignments
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Select Assignment Title:
              </label>
              {assignmentTitles.length > 0 ? (
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">-- Select Title --</option>
                  {assignmentTitles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-600">No assignment titles available.</p>
              )}
            </div>

            {selectedTitle && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Assignments for: {selectedTitle}</h4>
                {filteredAssignments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-4 py-2 border">Title</th>
                          <th className="px-4 py-2 border">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssignments.map((assignment) => (
                          <tr key={assignment._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border">{assignment.title}</td>
                            <td className="px-4 py-2 border">
                              <button
                                onClick={() => window.open(assignment.fileUrl, '_blank')}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No assignments found for &quot;{selectedTitle}&quot;.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-4 text-center">
          <p className="text-white text-sm">
            &copy; {new Date().getFullYear()} Kodu ERP. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
