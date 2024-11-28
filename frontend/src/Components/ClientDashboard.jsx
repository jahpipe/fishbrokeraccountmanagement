import React, { useState, useEffect } from 'react';
import { FaBars, FaDollarSign, FaHistory, FaSignOutAlt, FaHome, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AccountBalance from '../DashboardClientsComponents/AccountsBalance';
import TransactionHistory from '../DashboardClientsComponents/TransactionsHistory';

const ClientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to LoginForm
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'account-balance':
        return <AccountBalance />;
      case 'transaction-history':
        return <TransactionHistory />;
      default:
        return (
          <section id="home" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Welcome {user?.fullName}!</h2>
            <p className="text-lg">Find a summary of your activities and quick links to important sections.</p>
          </section>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 h-full p-4 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-gray-800 text-white md:translate-x-0 md:w-64 md:flex-shrink-0`}
      >
        <div className="flex items-center mb-6">
          <FaUserCircle className="mr-3 text-3xl" />
          <h2 className="text-2xl font-semibold">Client Dashboard</h2>
        </div>
        <ul className="flex flex-col flex-grow overflow-y-auto">
          <li className="mb-4">
            <button
              onClick={() => setActiveSection('home')}
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors w-full text-left"
            >
              <FaHome className="mr-3 text-xl" />
              Home
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => setActiveSection('account-balance')}
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors w-full text-left"
            >
              <FaDollarSign className="mr-3 text-xl" />
              Account Balance
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => setActiveSection('transaction-history')}
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors w-full text-left"
            >
              <FaHistory className="mr-3 text-xl" />
              Transaction History
            </button>
          </li>
          <li className="mt-auto">
            <button
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors w-full text-left"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-3 text-xl" />
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow p-6 md:ml-64">
        {/* Sidebar toggle button for mobile view */}
        <button
          className="fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-lg md:hidden"
          onClick={handleSidebarToggle}
        >
          <FaBars className="text-xl" />
        </button>

        {/* Render the active section */}
        {renderSection()}
      </div>
    </div>
  );
};

export default ClientDashboard;
