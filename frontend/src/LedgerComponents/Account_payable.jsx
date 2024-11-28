import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const Account_payable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const rowsPerPage = 10;

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/account-payable`);
      setAccounts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const getStatusClass = (status) => {
    if (status === 'paid') {
      return 'text-green-600 font-semibold';
    } else if (status === 'unpaid') {
      return 'text-red-600 font-semibold';
    }
    return '';
  };

  const handlePayment = async (accountId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/account-payable/${accountId}`, { status: 'paid' });
      // Update the accounts state to reflect the change
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === accountId ? { ...account, status: 'paid' } : account
        )
      );
    } catch (err) {
      setError(err.message);
    }
};


  const filteredAccounts = accounts.filter((account) => {
    if (startDate && endDate) {
      const accountDate = new Date(account.payable_date);
      return accountDate >= startDate && accountDate <= endDate;
    }
    return true;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAccounts.slice(indexOfFirstRow, indexOfFirstRow + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Account Payable</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="flex space-x-4 mb-4">
        <div>
          <label>Start Date: </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            isClearable
            placeholderText="Select Start Date"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label>End Date: </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            isClearable
            placeholderText="Select End Date"
            className="border p-2 rounded"
          />
        </div>
      </div>

      <div className="shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kilo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Payable</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payable Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((account) => (
              <tr key={account.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">{account.product_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.kilo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.total_price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.deduction}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.final_payable}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.payable_date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.supplier_name}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${getStatusClass(account.status)}`}>{account.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {account.status === 'unpaid' && (
                    <button
                      onClick={() => handlePayment(account.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center my-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Account_payable;
