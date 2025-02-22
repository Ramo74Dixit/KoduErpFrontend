// src/pages/ApproveUsers.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ApproveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch pending users list
    fetch('https://kodu-erp.onrender.com/api/admin/pending-users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use the token saved in localStorage
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`https://kodu-erp.onrender.com/api/admin/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send the admin's token
        },
        body: JSON.stringify({ action: 'approve' })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setUsers(users.filter(user => user._id !== userId));  // Remove approved user from list
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch(`https://kodu-erp.onrender.com/api/admin/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send the admin's token
        },
        body: JSON.stringify({ action: 'reject' })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setUsers(users.filter(user => user._id !== userId));  // Remove rejected user from list
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Approve Users</h2>
      <div>
        {users.length === 0 ? (
          <p>No users pending approval.</p>
        ) : (
          users.map(user => (
            <div key={user._id} className="p-4 bg-white shadow rounded mb-4">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <button onClick={() => handleApprove(user._id)} className="bg-green-500 text-white p-2 rounded">Approve</button>
              <button onClick={() => handleReject(user._id)} className="bg-red-500 text-white p-2 rounded ml-2">Reject</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApproveUsers;
