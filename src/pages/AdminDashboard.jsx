// src/pages/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg">
            Admin Dashboard
          </h2>
          <p className="text-lg text-white mt-2">
            Manage users, fees, queries, and more!
          </p>
        </header>
        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Approve Users Card */}
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105 cursor-pointer"
            onClick={() => navigateTo('/admin/approve-users')}
          >
            <h3 className="text-2xl font-semibold mb-2">Approve Users</h3>
            <p className="text-base">
              Approve or reject users like trainers, counsellors, etc.
            </p>
          </div>

          {/* View Today's Fee Collection Card */}
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105 cursor-pointer"
            onClick={() => navigateTo('/admin/today-fees')}
          >
            <h3 className="text-2xl font-semibold mb-2">
              Today's Fee Collection
            </h3>
            <p className="text-base">
              Review all fee payments received today.
            </p>
          </div>

          {/* View Student Queries Card */}
          <div
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105 cursor-pointer"
            onClick={() => navigateTo('/admin/view-queries')}
          >
            <h3 className="text-2xl font-semibold mb-2">Student Queries</h3>
            <p className="text-base">
              View and resolve student queries and issues.
            </p>
          </div>
          
          {/* Example Additional Card */}
          <div
            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105 cursor-pointer"
            onClick={() => navigateTo('/admin/reports')}
          >
            <h3 className="text-2xl font-semibold mb-2">Reports</h3>
            <p className="text-base">
              Generate and review various reports.
            </p>
          </div>
        </div>
        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-white text-sm">
            &copy; {new Date().getFullYear()} Kodu ERP. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
