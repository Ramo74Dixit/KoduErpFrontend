import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch batches for the logged-in trainer
    const fetchBatches = async () => {
      setLoading(true);
      setError(""); // Reset error on retry
      try {
        const response = await fetch("https://kodu-erp.onrender.com/api/batches/allbatches", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBatches(data.batches); // Store batches
        } else {
          throw new Error("Failed to fetch batches");
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
        setError("Error fetching batches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      // Fetch students for the selected batch
      const fetchStudents = async () => {
        setLoading(true);
        setError(""); // Reset error on retry
        try {
          const response = await fetch(`https://kodu-erp.onrender.com/api/batches/${selectedBatch}/batchwisestudents`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setStudents(data.students); // Store students for the batch
            // Set initial attendance status
            const initialAttendance = data.students.map((student) => ({
              studentId: student._id,
              status: "absent", // Default status is absent
            }));
            setAttendance(initialAttendance);
          } else {
            throw new Error("Failed to fetch students");
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          setError("Error fetching students. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchStudents();
    }
  }, [selectedBatch]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prevState) =>
      prevState.map((attendance) =>
        attendance.studentId === studentId ? { ...attendance, status } : attendance
      )
    );
  };

  const handleSubmit = async () => {
    const attendanceData = {
      batchId: selectedBatch,
      date,
      studentsAttendance: attendance,
    };

    setLoading(true);
    setError(""); // Reset error on retry
    try {
      const response = await fetch("https://kodu-erp.onrender.com/api/attendance/mark-students", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        alert("Attendance marked successfully");
        // Redirect after success if needed
        navigate("/trainer/dashboard"); // Example, go back to dashboard
      } else {
        throw new Error("Failed to mark attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError("Error submitting attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">Manage Attendance</h2>

      {/* Error message */}
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

      {/* Date Selection */}
      {selectedBatch && (
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Select Date</label>
          <input
            type="date"
            className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition ease-in-out"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      )}

      {/* Attendance Form */}
      {students.length > 0 && date && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Mark Attendance</h3>
          {students.map((student) => (
            <div key={student._id} className="flex justify-between items-center p-4 bg-gray-100 mb-3 rounded-lg shadow-sm">
              <span className="font-medium text-lg">{student.name}</span>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`attendance-${student._id}`}
                    value="present"
                    checked={attendance.find((a) => a.studentId === student._id)?.status === "present"}
                    onChange={() => handleAttendanceChange(student._id, "present")}
                    className="form-radio text-indigo-500"
                  />
                  <span className="ml-2">Present</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`attendance-${student._id}`}
                    value="absent"
                    checked={attendance.find((a) => a.studentId === student._id)?.status === "absent"}
                    onChange={() => handleAttendanceChange(student._id, "absent")}
                    className="form-radio text-red-500"
                  />
                  <span className="ml-2">Absent</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-4 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 transition"
        disabled={loading}
      >
        {loading ? "Submitting Attendance..." : "Submit Attendance"}
      </button>
    </div>
  );
};

export default ManageAttendance;
