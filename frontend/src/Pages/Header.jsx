import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="text-2xl font-bold tracking-widest uppercase hover:text-yellow-400 transition duration-300 ease-in-out">
          LOGO
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="flex items-center text-lg hover:text-yellow-400 transition duration-300 ease-in-out">
            <FaHome className="mr-2" /> HOME
          </Link>
          <a href="#about" className="flex items-center text-lg hover:text-yellow-400 transition duration-300 ease-in-out">
            <FaInfoCircle className="mr-2" /> ABOUT
          </a>
          <a href="#location" className="flex items-center text-lg hover:text-yellow-400 transition duration-300 ease-in-out">
            <FaMapMarkerAlt className="mr-2" /> LOCATION
          </a>
        </nav>
        <Link to="/login" className="bg-yellow-500 text-gray-800 px-4 py-2 rounded-md hover:bg-yellow-400 transition duration-300 ease-in-out flex items-center">
          <FaUser className="mr-2" /> LOGIN
        </Link>
      </div>
      {/* Mobile Menu */}
      <nav className="md:hidden flex justify-between px-4 pb-4">
        <Link to="/" className="flex items-center text-lg hover:text-yellow-400 transition duration-300 ease-in-out">
          <FaHome className="mr-2" /> HOME
        </Link>
        <a href="#about" className="flex items-center text-lg hover:text-yellow-400 transition duration-300 ease-in-out">
          <FaInfoCircle className="mr-2" /> ABOUT
        </a>
        <a href="#location" className="flex items-center text-lg hover:text-yellow-400 transition duration-300 ease-in-out">
          <FaMapMarkerAlt className="mr-2" /> LOCATION
        </a>
      </nav>
    </header>
  );
};

export default Header;
