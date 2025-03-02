import React, { useState, useEffect } from "react";
import Select from "react-select";

const AddBatch = () => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [batchName, setBatchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]); // Multiple students

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://kodu-erp.onrender.com/api/courses");
        const data = await response.json();
        if (response.ok) {
          setCourses(data);
        } else {
          alert("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Error fetching courses");
      }
    };

    fetchCourses();
  }, []);

  // Fetch students from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login first");
          return;
        }
        const response = await fetch("https://kodu-erp.onrender.com/api/students/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setStudents(data);
        } else {
          alert("Failed to fetch students");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Error fetching students");
      }
    };

    fetchStudents();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const batchData = {
      courseId,
      batchName,
      startDate,
      endDate,
      startTime,
      endTime,
      students: selectedStudents.map((student) => student.value),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch("https://kodu-erp.onrender.com/api/batches/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Batch added successfully");
        // Clear fields after success
        setCourseId("");
        setBatchName("");
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
        setSelectedStudents([]);
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error adding batch:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-3xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Create New Batch
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            {/* Batch Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                required
              />
            </div>
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            {/* Students (Multi-select) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Students
              </label>
              <Select
                isMulti
                name="students"
                options={students.map((student) => ({
                  value: student._id,
                  label: student.name,
                }))}
                className="w-full"
                onChange={setSelectedStudents}
              />
            </div>
          </div>
          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBatch;
