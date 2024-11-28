import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
        <FaExclamationTriangle className="text-red-500 mx-auto mb-4 text-6xl" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-400 transition duration-300 ease-in-out">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
