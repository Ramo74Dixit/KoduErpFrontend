import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const StudentAttendanceSummary = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all batches for the trainer
  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("https://kodu-erp.onrender.com/api/batches/allbatches", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBatches(data.batches);
        } else {
          throw new Error("Failed to fetch batches");
        }
      } catch (err) {
        console.error("Error fetching batches:", err);
        setError("Error fetching batches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [token]);

  // When a batch is selected, fetch its students
  useEffect(() => {
    if (selectedBatch) {
      const fetchStudents = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await fetch(
            `https://kodu-erp.onrender.com/api/batches/${selectedBatch}/batchwisestudents`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setStudents(data.students);
          } else {
            throw new Error("Failed to fetch students");
          }
        } catch (err) {
          console.error("Error fetching students:", err);
          setError("Error fetching students. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchStudents();
    } else {
      setStudents([]);
      setSelectedStudent("");
    }
  }, [selectedBatch, token]);

  // When both batch and student are selected, fetch attendance summary
  useEffect(() => {
    if (selectedBatch && selectedStudent) {
      const fetchAttendanceSummary = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await fetch(
            `https://kodu-erp.onrender.com/api/attendance/summary/student/${selectedStudent}/${selectedBatch}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setAttendanceData(data);
          } else {
            throw new Error("Failed to fetch attendance summary");
          }
        } catch (err) {
          console.error("Error fetching attendance summary:", err);
          setError("Error fetching attendance summary. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchAttendanceSummary();
    } else {
      setAttendanceData(null);
    }
  }, [selectedBatch, selectedStudent, token]);

  // Calculate attendance percentage and prepare pie chart data if available
  let attendancePercentage = 0;
  let pieData = null;
  if (attendanceData) {
    const { totalDays, presentDays, absentDays, lateDays } = attendanceData;
    attendancePercentage = totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
    pieData = {
      labels: ["Present", "Absent", "Late"],
      datasets: [
        {
          data: [presentDays, absentDays, lateDays],
          backgroundColor: ["#00c853", "#d50000", "#ff9800"],
        },
      ],
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fc466b] to-[#3f5efb] p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Student Attendance Summary
        </h1>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        {/* Batch Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Select Batch</label>
          <select
            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition ease-in-out"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            required
          >
            <option value="">Select Batch</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.batchName}
              </option>
            ))}
          </select>
        </div>

        {/* Student Selection */}
        {selectedBatch && (
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold">Select Student</label>
            <select
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition ease-in-out"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-4 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Attendance Summary Display */}
        {attendanceData && (
          <div className="bg-white p-6 rounded-lg shadow border mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
              Attendance Summary
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-around">
              {pieData && (
                <div className="w-40 h-40 sm:w-48 sm:h-48 mb-6 md:mb-0">
                  <Pie data={pieData} />
                </div>
              )}
              <div className="text-center md:text-left space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  Present: <span className="text-green-600">{attendanceData.presentDays}</span>
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  Absent: <span className="text-red-600">{attendanceData.absentDays}</span>
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  Late: <span className="text-yellow-600">{attendanceData.lateDays}</span>
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  Attendance:{" "}
                  <span
                    className={
                      attendancePercentage > 75
                        ? "text-green-600"
                        : attendancePercentage > 50
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {attendancePercentage}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedStudent && !attendanceData && !loading && (
          <p className="text-center text-gray-600 mt-4">
            No attendance records found for the selected student.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceSummary;
