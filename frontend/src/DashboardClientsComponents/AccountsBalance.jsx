import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const formatCurrency = (amount) => {
  if (isNaN(amount)) return '₱0.00';
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Math.abs(amount));
};

const AccountBalance = () => {
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totals, setTotals] = useState({ credit: 0, debit: 0, balance: 0 });

  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    const fetchAccountBalance = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const query = startDate && endDate ? `?start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}` : '';
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/account-balance/extended/${userId}${query}`);
        setAccountData(response.data);

        // Calculate totals for Credit, Debit, and Balance
        const totalDebit = response.data.reduce((sum, account) => sum + (parseFloat(account.debit_amount) || 0), 0);
        const totalCredit = response.data.reduce((sum, account) => sum + (parseFloat(account.credit_amount) || 0), 0);
        
        // Set initial balance to the first credit amount
        const initialBalance = totalCredit; // or set a specific initial balance if applicable
        let currentBalance = initialBalance;

        // Calculate balance for each account entry
        const updatedAccountData = response.data.map((account) => {
          const debitAmount = parseFloat(account.debit_amount) || 0;

          // Calculate new balance after applying the debit
          currentBalance -= debitAmount;

          return {
            ...account,
            currentBalance: currentBalance.toFixed(2) // Adding calculated balance to account object
          };
        });

        setAccountData(updatedAccountData);
        setTotals({ debit: totalDebit.toFixed(2), credit: totalCredit.toFixed(2), balance: currentBalance.toFixed(2) });
      } catch (error) {
        setError('Error fetching account balance. Please try again.');
        console.error('Error fetching account balance:', error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBalance();
  }, [userId, startDate, endDate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Account Balance</h2>

      {/* Date Picker */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-2">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border border-gray-300 p-2 rounded"
            placeholderText="Select start date"
            dateFormat="yyyy/MM/dd"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border border-gray-300 p-2 rounded"
            placeholderText="Select end date"
            dateFormat="yyyy/MM/dd"
          />
        </div>
      </div>

      {accountData.length === 0 ? (
        <p>No account balance data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded mb-4 text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-2 px-2 sm:px-4">Invoice Date</th>
                <th className="py-2 px-2 sm:px-4">Due Date</th>
                <th className="py-2 px-2 sm:px-4">Transaction Date</th>
                <th className="py-2 px-2 sm:px-4">Debit Amount</th>
                <th className="py-2 px-2 sm:px-4">Credit Amount</th>
                <th className="py-2 px-2 sm:px-4">Balance</th>
              </tr>
            </thead>
            <tbody>
              {accountData.map((account, index) => (
                <tr key={account.invoice_id} className="border-b">
                  <td className="py-2 px-2 sm:px-4">{new Date(account.invoice_date).toLocaleDateString() || 'N/A'}</td>
                  <td className="py-2 px-2 sm:px-4">{new Date(account.due_date).toLocaleDateString() || 'N/A'}</td>
                  <td className="py-2 px-2 sm:px-4">{new Date(account.transaction_date).toLocaleDateString() || 'N/A'}</td>
                  <td className="py-2 px-2 sm:px-4">{formatCurrency(account.debit_amount)}</td>
                  <td className="py-2 px-2 sm:px-4">{formatCurrency(account.credit_amount)}</td>
                  <td className="py-2 px-2 sm:px-4">{formatCurrency(account.currentBalance)}</td> {/* Display calculated balance */}
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-gray-100 font-semibold">
                <td className="py-2 px-2 sm:px-4 text-right" colSpan={3}>Totals:</td>
                <td className="py-2 px-2 sm:px-4">{formatCurrency(totals.debit)}</td>
                <td className="py-2 px-2 sm:px-4">{formatCurrency(totals.credit)}</td>
                <td className="py-2 px-2 sm:px-4">{formatCurrency(totals.balance)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AccountBalance;
