import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminQueries = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('https://kodu-erp.onrender.com/api/complaints/all', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch queries');
        return res.json();
      })
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#fc466b] to-[#3f5efb]">
        <div className="text-white text-2xl">Loading queries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#fc466b] to-[#3f5efb]">
        <div className="text-red-600 text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fc466b] to-[#3f5efb] p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 p-6">
          <h1 className="text-3xl text-white font-bold">Student Queries</h1>
        </div>
        {/* Content */}
        <div className="p-6 md:p-8">
          {complaints.length === 0 ? (
            <p className="text-center text-gray-600">No queries found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">Student Name</th>
                    <th className="px-4 py-2 border">Student Email</th>
                    <th className="px-4 py-2 border">Trainer Name</th>
                    <th className="px-4 py-2 border">Trainer Email</th>
                    <th className="px-4 py-2 border">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">
                        {complaint.student?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-2 border">
                        {complaint.student?.email || 'N/A'}
                      </td>
                      <td className="px-4 py-2 border">
                        {complaint.trainer?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-2 border">
                        {complaint.trainer?.email || 'N/A'}
                      </td>
                      <td className="px-4 py-2 border">{complaint.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

export default AdminQueries;
