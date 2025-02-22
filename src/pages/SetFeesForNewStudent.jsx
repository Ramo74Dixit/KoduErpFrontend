import React, { useState, useEffect } from 'react';

const SetFeesForStudent = () => {
  const [students, setStudents] = useState([]); // Array to store students
  const [selectedStudentId, setSelectedStudentId] = useState(''); // Selected student ID
  const [feeAmount, setFeeAmount] = useState(''); // Fee input field
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token'); // Token for authentication

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://kodu-erp.onrender.com/api/students/all', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        console.log(data); // Debugging: log the response
  
        if (response.ok) {
          setStudents(data); // Store students in state
        } else {
          alert(data.message || 'Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    fetchStudents();
  }, [token]);
  

  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedStudentId || !feeAmount) {
      alert('Please select a student and enter the fee amount');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://kodu-erp.onrender.com/api/fees/set-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: selectedStudentId,
          totalFee: feeAmount,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Fee successfully set');
      } else {
        alert(result.message || 'Failed to set fee');
      }
    } catch (error) {
      console.error('Error setting fee:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6">Set Fees for New Student</h2>

      {loading && <p>Loading...</p>}

      <form onSubmit={handleFeeSubmit} className="space-y-4">
        <div>
          <label htmlFor="student" className="block text-sm font-medium">Select Student</label>
          <select
            id="student"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="block w-full mt-2 p-2 border border-gray-300 rounded"
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="feeAmount" className="block text-sm font-medium">Fee Amount</label>
          <input
            type="number"
            id="feeAmount"
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
            className="block w-full mt-2 p-2 border border-gray-300 rounded"
            placeholder="Enter total fee"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4" disabled={loading}>
          {loading ? 'Submitting...' : 'Set Fee'}
        </button>
      </form>
    </div>
  );
};

export default SetFeesForStudent;
