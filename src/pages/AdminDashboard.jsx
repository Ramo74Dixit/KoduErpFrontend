// src/pages/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
      
      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Approve Users Card */}
        <div 
          className="card bg-blue-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600" 
          onClick={() => navigateTo('/admin/approve-users')}
        >
          <h3 className="text-lg font-semibold">Approve Users</h3>
          <p className="mt-2">Approve or reject users like trainer, counsellor, etc.</p>
        </div>

        {/* View Today's Fee Collection Card */}
        <div 
          className="card bg-green-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-green-600"
          onClick={() => navigateTo('/admin/today-fees')}
        >
          <h3 className="text-lg font-semibold">View Today's Fee Collection</h3>
          <p className="mt-2">View all fee payments received today.</p>
        </div>

        {/* View Student Queries Card */}
        <div 
          className="card bg-yellow-500 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-600"
          onClick={() => navigateTo('/admin/view-queries')}
        >
          <h3 className="text-lg font-semibold">View Student Queries</h3>
          <p className="mt-2">View and resolve student queries.</p>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
