import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AssignmentUpload = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("https://kodu-erp.onrender.com/api/batches/allbatches", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch batches");
        const data = await response.json();
        setBatches(data.batches || []);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch || !assignmentName || !file) {
      alert("Please fill all fields");
      return;
    }
    const formData = new FormData();
    formData.append("batchId", selectedBatch);
    formData.append("title", assignmentName);
    formData.append("assignmentFile", file);

    try {
      const res = await fetch("/api/assignments/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
          // Do not set Content-Type with FormData
        },
        body: formData,
      });
      if (res.status === 201) {
        alert("Assignment uploaded successfully");
        navigate("/trainer/dashboard");
      } else {
        alert("Error uploading assignment");
      }
    } catch (error) {
      console.error("Error uploading assignment:", error);
      alert("Error uploading assignment");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506765515384-028b60a970df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>
      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-center text-white mb-10 drop-shadow-lg">
          Upload Assignment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch Selection */}
          <div>
            <label className="block text-lg font-medium text-white mb-2">
              Select Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition"
              required
            >
              <option value="">Select a batch</option>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.batchName || batch.name || "Unnamed Batch"}
                  </option>
                ))
              ) : (
                <option value="">No batches available</option>
              )}
            </select>
          </div>
          {/* Assignment Name */}
          <div>
            <label className="block text-lg font-medium text-white mb-2">
              Assignment Name
            </label>
            <input
              type="text"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              placeholder="Enter assignment title"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition"
              required
            />
          </div>
          {/* File Upload */}
          <div>
            <label className="block text-lg font-medium text-white mb-2">
              Upload File
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-white"
              required
            />
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-800 text-white font-semibold rounded-lg shadow transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Upload Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentUpload;
