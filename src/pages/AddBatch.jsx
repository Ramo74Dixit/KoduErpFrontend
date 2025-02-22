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

  // Fetching courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "https://kodu-erp.onrender.com/api/courses"
        );
        const data = await response.json();
        if (response.ok) {
          setCourses(data); // Store courses data
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

  // Fetching students from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage: ", token); // Check token value

        if (!token) {
          alert("Please login first");
          return;
        }

        const response = await fetch(
          "https://kodu-erp.onrender.com/api/students/all",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setStudents(data); // Store students data
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
    console.log("Selected Students: ", selectedStudents); // Check selected students

    const batchData = {
      courseId,
      batchName,
      startDate,
      endDate,
      startTime,
      endTime,
      students: selectedStudents.map(student => student.value), // Send student IDs
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      // Log request for debugging
      console.log("Sending request with batch data:", batchData);

      const response = await fetch(
        "https://kodu-erp.onrender.com/api/batches/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,  // Pass token here
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batchData),
        }
      );

      // Log the raw response
      console.log("Response Status:", response.status);
      const result = await response.json();
      console.log("Response Body:", result);  // Log full response body for debugging

      if (response.ok) {
        alert("Batch added successfully");
        // Clear fields after success
        setCourseId("");
        setBatchName("");
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
        setSelectedStudents([]); // Reset students
      } else {
        console.error("Error details:", result);
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add New Batch</h2>
      <form onSubmit={handleSubmit}>
        {/* Course Selection */}
        <div className="mb-4">
          <label className="block text-gray-700">Course</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full px-4 py-2 border rounded"
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
        <div className="mb-4">
          <label className="block text-gray-700">Batch Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            required
          />
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {/* Start Time */}
        <div className="mb-4">
          <label className="block text-gray-700">Start Time</label>
          <input
            type="time"
            className="w-full px-4 py-2 border rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        {/* End Time */}
        <div className="mb-4">
          <label className="block text-gray-700">End Time</label>
          <input
            type="time"
            className="w-full px-4 py-2 border rounded"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        {/* Students (Multiple Select) */}
        <div className="mb-4">
          <label className="block text-gray-700">Students</label>
          <Select
            isMulti
            name="students"
            options={students.map((student) => ({
              value: student._id,
              label: student.name,
            }))}
            className="w-full"
            onChange={setSelectedStudents} // Handle multiple selection
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Adding Batch..." : "Add Batch"}
        </button>
      </form>
    </div>
  );
};

export default AddBatch;
