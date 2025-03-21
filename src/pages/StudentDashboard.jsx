import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import AssignmentsSection from './AssignmentSection';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [complaintMessage, setComplaintMessage] = useState('');
  const [complaintStatus, setComplaintStatus] = useState(null);
  const [complaintError, setComplaintError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Decode token to get userId
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
        fetchAssignments(batchId, token);
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

  const fetchAssignments = (batchId, token) => {
    fetch(`https://kodu-erp.onrender.com/api/assignments/batch/${batchId}/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data);
      })
      .catch((error) => console.error('Error fetching assignments:', error));
  };

  const uploadAssignmentLink = (assignmentId, githubLink) => {
    const token = localStorage.getItem('token');

    // Request to upload assignment submission
    fetch(`https://kodu-erp.onrender.com/api/assignments/batches/${student.batchId}/assignments/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ assignmentId, submissionLink: githubLink }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to upload assignment link');
        return res.json();
      })
      .then((data) => {
        // Update the specific assignment with the returned updated assignment data
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment._id === assignmentId ? data.assignment : assignment
          )
        );
      })
      .catch((error) => alert(error.message));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    setComplaintStatus(null);
    setComplaintError(null);
    const token = localStorage.getItem('token');

    if (!complaintMessage.trim()) {
      setComplaintError("Complaint message cannot be empty");
      return;
    }

    fetch('https://kodu-erp.onrender.com/api/complaints/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: complaintMessage }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.message || "Failed to file complaint") });
        }
        return res.json();
      })
      .then((data) => {
        setComplaintStatus(data.message);
        setComplaintMessage('');
      })
      .catch((error) => {
        console.error("Error filing complaint:", error);
        setComplaintError(error.message || "Error filing complaint");
      });
  };

  if (!student || !attendanceData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#fc466b] to-[#3f5efb]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const { totalDays, presentDays, absentDays } = attendanceData;
  const attendancePercentage = totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

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
      <div className="max-w-6xl mx-auto bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
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

          {/* Updated AssignmentsSection with student prop */}
          <AssignmentsSection 
            assignments={assignments}
            uploadAssignmentLink={uploadAssignmentLink}
            student={student}
          />

          {/* Complaint Submission Section */}
          <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-1 rounded-lg shadow-lg">
            <div className="bg-white p-4 md:p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-purple-600 pl-3">
                Submit a Complaint
              </h3>
              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                <textarea
                  value={complaintMessage}
                  onChange={(e) => setComplaintMessage(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your complaint here..."
                ></textarea>
                {complaintStatus && (
                  <p className="text-green-600 font-semibold">{complaintStatus}</p>
                )}
                {complaintError && (
                  <p className="text-red-600 font-semibold">{complaintError}</p>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded text-white font-semibold"
                >
                  Submit Complaint
                </button>
              </form>
            </div>
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
