import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function StockManagementSystem() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [stockBalance, setStockBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to format date to YYYY-MM-DD
  const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stockInResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/stockin`);
        const stockOutResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/stockout`);

        if (Array.isArray(stockInResponse.data) && Array.isArray(stockOutResponse.data)) {
          setStockIn(stockInResponse.data);
          setStockOut(stockOutResponse.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter stock in for the selected date
  const getStockForDate = (date) => {
    return stockIn.filter(item => formatDate(item.date) === formatDate(date));
  };

  // Filter stock out for the selected date
  const getStockOutForDate = (date) => {
    return stockOut.filter(item => formatDate(item.stockout_date) === formatDate(date));
  };

  // Calculate total sales for the selected date
  const calculateTotalSales = (date) => {
    const stockOutForDate = getStockOutForDate(date);
    return stockOutForDate.reduce((total, item) => {
      return total + (parseFloat(item.quantity) * parseFloat(item.unit_price) || 0);
    }, 0);
  };

  // Calculate stock balance
  const calculateStockBalance = (date) => {
    const stockInForDate = getStockForDate(date);
    const stockOutForDate = getStockOutForDate(date);

    const balance = stockInForDate.map(stockInItem => {
      const matchingStockOut = stockOutForDate.filter(stockOutItem => stockOutItem.product_name === stockInItem.product_name);
      const totalStockOut = matchingStockOut.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);

      return {
        product_name: stockInItem.product_name,
        balance: (parseFloat(stockInItem.weight) || 0) - totalStockOut,
      };
    });

    setStockBalance(balance);
  };

  // Update the active date and balance calculation
  useEffect(() => {
    const fetchedDates = [...new Set(stockIn.map(item => formatDate(item.date)))].sort((a, b) => new Date(b) - new Date(a));
    setDates(fetchedDates);

    if (fetchedDates.length > 0 && !dates.includes(formatDate(activeDate))) {
      const mostRecentDate = new Date(fetchedDates[0]);
      setActiveDate(mostRecentDate);
    }
  }, [stockIn]);

  // Calculate balance whenever stockIn, stockOut, or activeDate changes
  useEffect(() => {
    if (stockIn.length > 0 && stockOut.length > 0) {
      calculateStockBalance(activeDate);
    }
  }, [stockIn, stockOut, activeDate]);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Stock Management System</h1>

      {/* Date Picker */}
      <div className="mb-8 text-center">
        <DatePicker
          selected={activeDate}
          onChange={(date) => setActiveDate(date)}
          className="w-full max-w-xs px-4 py-2 border border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          dateFormat="yyyy/MM/dd"
        />
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Total Sales</h2>
          <p className="text-3xl font-semibold text-blue-600">
            ₱{calculateTotalSales(activeDate).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Remaining Stock</h2>
          <ul className="text-gray-600">
            {stockBalance.map((item, index) => (
              <li key={index}>
                {item.product_name}: {item.balance} kg
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Most Recent Stock Update</h2>
          <p>{formatDate(activeDate)}</p>
        </div>
      </div>

      {/* Stock IN Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">Stock IN</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              {['Date', 'Product Name', 'Weight (kg)', 'Price', 'Arrival Time'].map((header, index) => (
                <th key={index} className="py-3 px-4 border border-gray-300 text-left text-gray-700">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getStockForDate(activeDate).map((item, index) => (
              <tr key={index} className="border-t hover:bg-blue-50 transition-colors duration-200">
                <td className="py-2 px-4 border border-gray-300">{formatDate(item.date)}</td>
                <td className="py-2 px-4 border border-gray-300">{item.product_name}</td>
                <td className="py-2 px-4 border border-gray-300">{item.weight}</td>
                <td className="py-2 px-4 border border-gray-300">₱{item.price}</td>
                <td className="py-2 px-4 border border-gray-300">{item.arrival_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock OUT Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-700 text-center">Stock OUT</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-red-100">
            <tr>
              {['Invoice ID', 'Date', 'Product Name', 'Quantity', 'Unit Price'].map((header, index) => (
                <th key={index} className="py-3 px-4 border border-gray-300 text-left text-gray-700">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getStockOutForDate(activeDate).length > 0 ? (
              getStockOutForDate(activeDate).map((item, index) => (
                <tr key={index} className="border-t hover:bg-red-50 transition-colors duration-200">
                  <td className="py-2 px-4 border border-gray-300">{item.invoice_id}</td>
                  <td className="py-2 px-4 border border-gray-300">{formatDate(item.stockout_date)}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.product_name}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.quantity}</td>
                  <td className="py-2 px-4 border border-gray-300">₱{item.unit_price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 border border-gray-300 text-center">No data available for the selected date.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockManagementSystem;
