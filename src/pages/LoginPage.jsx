import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for routing

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Use navigate for redirection

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      // Make the API call to log in the user
      const response = await fetch('https://kodu-erp.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        // Clear previous token if any
        localStorage.removeItem('token');  // Clear the old token
        localStorage.setItem('token', result.token); // Store the new token

        // Decode the token to get the userId and role
        const decodedToken = JSON.parse(atob(result.token.split('.')[1]));  // Decode JWT token
        console.log(decodedToken);

        // Now, use the correct userId and role to navigate
        if (decodedToken.role === 'student') {
          navigate('/student-dashboard');
        } else if (decodedToken.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (decodedToken.role === 'trainer') {
          navigate('/trainer-dashboard');
        } else if (decodedToken.role === 'counsellor') {
          navigate('/counsellor-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('There was an error during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert('Registration successful!');
    navigate('/register'); // Redirect to the register page
  };

  const handleNewUserClick = () => {
    setIsRegistering(true);
    navigate('/register');  // Redirect to the register page
  };

  const handleExistingUserClick = () => {
    setIsRegistering(false);
    navigate('/login');  // Redirect to the login page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
          {isRegistering && (
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {isRegistering && (
            <div className="mb-4">
              <label className="block text-gray-700">Select Role</label>
              <select className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600">
                <option value="trainer">Trainer</option>
                <option value="counsellor">Counsellor</option>
                <option value="student">Student</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-full mt-4 hover:bg-indigo-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        {!isRegistering ? (
          <p className="mt-4 text-center">
            New user?{' '}
            <button onClick={handleNewUserClick} className="text-indigo-600 hover:underline">
              Register here
            </button>
          </p>
        ) : (
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <button onClick={handleExistingUserClick} className="text-indigo-600 hover:underline">
              Login here
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
