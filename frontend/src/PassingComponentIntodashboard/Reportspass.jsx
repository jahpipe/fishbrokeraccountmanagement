import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaClipboardList, FaBox, FaFileInvoice } from 'react-icons/fa'; // Importing React Icons
import { Link } from 'react-router-dom';  // Import Link

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

// Combined Summary Component with Pie Charts
const CombinedSummary = ({ payableSummary, totals }) => {
  const payableData = {
    labels: ['Final Payable', 'Total Paid', 'Total Unpaid'],
    datasets: [
      {
        data: [
          parseFloat(payableSummary.final_payable),
          parseFloat(payableSummary.total_paid),
          parseFloat(payableSummary.total_unpaid),
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // teal
          'rgba(54, 162, 235, 0.6)', // blue
          'rgba(255, 206, 86, 0.6)',  // yellow
        ],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const salesData = {
    labels: ['Total Credits', 'Total Debits', 'Outstanding Balance'],
    datasets: [
      {
        data: [
          totals.credits,
          totals.debits,
          totals.outstanding,
        ],
        backgroundColor: [
          'rgba(153, 102, 255, 0.6)', // purple
          'rgba(255, 99, 132, 0.6)', // red
          'rgba(255, 206, 86, 0.6)',  // yellow
        ],
        borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-1/2 p-2">
          <h2 className="text-lg font-semibold text-center mb-2">Payable Summary</h2>
          <Pie data={payableData} />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <h2 className="text-lg font-semibold text-center mb-2">Sales Summary</h2>
          <Pie data={salesData} />
        </div>
      </div>
    </div>
  );
};

// Supplier Count Component
const TotalSupplier = () => {
  const [supplierCount, setSupplierCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/supplier/suppliers`);
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setSupplierCount(data.length); // Count total suppliers
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className="max-w-lg w-full p-6 rounded-lg border border-gray-300 shadow-lg bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">
        <FaClipboardList className="inline-block mr-2" />
        Total Suppliers
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-200">{error}</p>
      ) : (
        <p className="text-center text-xl">
          Total Suppliers: <span className="font-semibold">{supplierCount}</span>
        </p>
      )}
  
      {/* Link to SupplierView component */}
      
    </div>
  );
};

// Admins and Users Count Component
const TotalUsers = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users`); // Adjust API endpoint as necessary
      const users = response.data;
      const admins = users.filter(user => user.role === 'admin');
      const clients = users.filter(user => user.role === 'client');

      setAdminCount(admins.length); // Count total admins
      setUserCount(clients.length);  // Count total clients/users
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-lg w-full p-6 rounded-lg border border-gray-300 shadow-lg bg-gradient-to-r from-purple-400 to-pink-500 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">
        <FaUsers className="inline-block mr-2" /> {/* Using React Icon */}
        Admin   &nbsp;&nbsp;&nbsp;&nbsp; Customer 
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-200">{error}</p>
      ) : (
        <div className="text-center text-xl">
          <div className="flex justify-around">
            <p>Total Admins: <span className="font-semibold">{adminCount}</span></p>
            <p>Total Customer: <span className="font-semibold">{userCount}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

// Total Invoices Component
const TotalInvoices = () => {
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoices`);
      const invoicesData = response.data;

      // Count only active invoices
      setInvoiceCount(invoicesData.filter(invoice => invoice.is_active).length);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="max-w-lg w-full p-6 rounded-lg border border-gray-300 shadow-lg bg-gradient-to-r from-blue-400 to-teal-500 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">
        <FaFileInvoice className="inline-block mr-2" /> {/* Using React Icon */}
        Total Invoices Created
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-200">{error}</p>
      ) : (
        <p className="text-center text-xl">
          Total Invoices Created: <span className="font-semibold">{invoiceCount}</span>
        </p>
      )}
    </div>
  );
};

// Deliveries Today Component
const DeliveriesToday = () => {
  const [todayDeliveriesCount, setTodayDeliveriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date();

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products`); // Adjust API endpoint as necessary
      const products = response.data;

      // Count today's deliveries
      const todayCount = products.filter(product => {
        const productDate = new Date(product.arrival_date);
        return (
          productDate.getDate() === today.getDate() &&
          productDate.getMonth() === today.getMonth() &&
          productDate.getFullYear() === today.getFullYear()
        );
      }).length;

      setTodayDeliveriesCount(todayCount);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="max-w-lg w-full p-6 rounded-lg border border-gray-300 shadow-lg bg-gradient-to-r from-yellow-400 to-red-500 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">
        <FaBox className="inline-block mr-2" /> {/* Using React Icon */}
        Products Deliveries
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-200">{error}</p>
      ) : (
        <p className="text-center text-xl">
          Total Deliveries Today: <span className="font-semibold">{todayDeliveriesCount}</span>
        </p>
      )}
    </div>
  );
};

// Main Component
const Reportspass = () => {
    const [summary, setSummary] = useState(null);
    const [totals, setTotals] = useState({ credits: 0, debits: 0, outstanding: 0, entries: 0 });
    const [error, setError] = useState(null);
    const [summaryDate, setSummaryDate] = useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today for end date
  
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/summaryreport?date=${summaryDate}`);
        setSummary(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setSummary(null);
      }
    };

  const fetchTotals = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/salesreport?start_date=${summaryDate}&end_date=${endDate}`);
      let totalCredits = 0;
      let totalDebits = 0;
      let totalOutstanding = 0;

      if (Array.isArray(response.data) && response.data.length > 0) {
        response.data.forEach(invoice => {
          totalCredits += parseFloat(invoice.sale_total) || 0;
          totalDebits += parseFloat(invoice.paid_amount) || 0;
          totalOutstanding += parseFloat(invoice.outstanding_balance) || 0;
        });
      }

      setTotals({
        credits: totalCredits,
        debits: totalDebits,
        outstanding: totalOutstanding,
        entries: response.data.length,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTotals(); // Fetch totals whenever summaryDate or endDate changes
  }, [summaryDate, endDate]);


  return (
    <div className="p-6 min-h-screen">
  {error && <p className="text-red-500 text-center">{error}</p>}

  <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
  <div className="w-full md:w-1/2">
      <TotalUsers /> {/* Display total admins and users */}
    </div>
    <div className="w-full md:w-1/2">
      <TotalSupplier /> {/* Display total suppliers */}
    </div>
  </div>

  {/* Flex container for DeliveriesToday and TotalInvoices */}
  <div className="flex flex-col md:flex-row mb-8 space-y-4 md:space-y-0 md:space-x-4">
    <div className="w-full md:w-1/2">
      <DeliveriesToday /> {/* Display today's deliveries */}
    </div>
    <div className="w-full md:w-1/2">
      <TotalInvoices /> {/* Display total invoices created */}
    </div>
  </div>

  {summary ? (
    <CombinedSummary 
      payableSummary={summary.payable_summary} 
      totals={totals} 
    />
  ) : (
    <p className="text-gray-600 text-center mt-4">Loading summary report...</p>
  )}
</div>

  );
};

export default Reportspass;
