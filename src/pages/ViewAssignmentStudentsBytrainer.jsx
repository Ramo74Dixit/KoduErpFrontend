import React, { useState, useEffect } from 'react';

const AssignmentView = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [assignments, setAssignments] = useState([]);

  // Fetch batches from the provided API using fetch
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch('https://kodu-erp.onrender.com/api/batches/allbatches');
        if (!res.ok) throw new Error('Failed to fetch batches');
        const data = await res.json();
        setBatches(data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchBatches();
  }, []);

  const handleBatchChange = async (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);
    if (!batchId) {
      setAssignments([]);
      return;
    }

    // Get token from localStorage (adjust as necessary)
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`https://kodu-erp.onrender.com/api/batches/${batchId}/student-assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setAssignments([]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">View Assignments</h2>
      <div className="mb-4">
        <label className="block mb-2">Select Batch</label>
        <select 
          value={selectedBatch} 
          onChange={handleBatchChange} 
          className="w-full p-2 border rounded"
        >
          <option value="">Select a batch</option>
          {batches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.name}
            </option>
          ))}
        </select>
      </div>
      {assignments.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Assignment Name</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment._id}>
                <td className="border p-2">{assignment.student || 'N/A'}</td>
                <td className="border p-2">{assignment.title}</td>
                <td className="border p-2">
                  <a 
                    href={assignment.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 underline"
                  >
                    View Assignment
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedBatch && <p>No assignments found for this batch.</p>
      )}
    </div>
  );
};

export default AssignmentView;
