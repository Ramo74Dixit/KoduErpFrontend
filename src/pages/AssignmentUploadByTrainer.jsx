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
        console.log("Fetched batches:", data);
        // Response se batches property extract karen
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
          // Content-Type set na karein, browser FormData ka boundary khud handle karega
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
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Upload Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Select Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full p-2 border rounded"
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
        <div className="mb-4">
          <label className="block mb-2">Assignment Name</label>
          <input
            type="text"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default AssignmentUpload;
