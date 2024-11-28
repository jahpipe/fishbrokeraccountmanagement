import React, { useState } from 'react';
import { FaUser, FaLock, FaUserTag } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const payload = { username, password, role };
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/login`, payload);
      console.log('Response:', response.data);

      if (response.status === 200) {
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        alert(`Welcome, ${userData.fullName}!`);

        // Redirect based on user role
        switch (userData.role) {
          case 'client':
            navigate('/clientdashboard');
            break;
          case 'admin':
            navigate('/dashboard');
            break;
          default:
            navigate('/clientdashboard');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      const errorMessage = error.response?.data?.message || 'Unable to connect to the server. Please try again later.';
      setError(errorMessage);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className={`max-w-md w-full bg-white bg-opacity-90 shadow-lg rounded-lg p-8 space-y-6 transition-transform ${shake ? 'animate-shake' : ''}`}>
        <div className="flex justify-center mb-4">
        <img src="/image/anupic.jpg" alt="Logo" style={{ width: '100%', height: 'auto', maxHeight: '120px', maxWidth: '400px' }} />


        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-gray-700 rounded-md shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-gray-700 rounded-md shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 ease-in-out"
              required
            />
          </div>
          <div className="relative">
            <FaUserTag className="absolute top-3 left-3 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-gray-700 rounded-md shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 ease-in-out"
            >
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-400 transition duration-300 ease-in-out"
            disabled={loading} // Disable the button when loading
          >
            {loading ? 'Logging in...' : 'Login'} {/* Show "Logging in..." when loading */}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
