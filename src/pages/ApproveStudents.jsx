import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApproveStudents = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token'); // Ensure token is available
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    }

    const fetchPendingStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://kodu-erp.onrender.com/api/students/pending', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok) {
          // Ensure result is an array
          setPendingStudents(Array.isArray(result) ? result : []);
        } else {
          alert(result.message || 'Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingStudents();
  }, [token, navigate]);

  const approveStudent = async (studentId) => {
    try {
      const response = await fetch(
        `https://kodu-erp.onrender.com/api/students/approve/${studentId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'approve' }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setPendingStudents((prev) =>
          prev.filter((student) => student._id !== studentId)
        ); // Remove approved student from list
      } else {
        alert(result.message || 'Failed to approve student');
      }
    } catch (error) {
      console.error('Error approving student', error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6">Approve Students</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {Array.isArray(pendingStudents) && pendingStudents.length > 0 ? (
              pendingStudents.map((student) => (
                <li
                  key={student._id}
                  className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl"
                >
                  <span>{student.name}</span>
                  <button
                    onClick={() => approveStudent(student._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                </li>
              ))
            ) : (
              <p>No pending students found.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApproveStudents;
