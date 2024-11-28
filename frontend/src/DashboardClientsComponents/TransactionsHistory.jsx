import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = JSON.parse(localStorage.getItem('user'))?.id; // Retrieve userId

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/transactions?userId=${userId}`);
        setTransactionData(response.data); // Set the fetched transaction data
      } catch (error) {
        setError('Error fetching transactions. Please try again.');
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchTransactions(); // Call the function to fetch transactions
  }, [userId]);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p>{error}</p>; // Show error message

  // Calculate totals
  const totalAmount = transactionData.reduce((acc, transaction) => acc + parseFloat(transaction.total_amount || 0), 0);
  const totalDownPayment = transactionData.reduce((acc, transaction) => acc + parseFloat(transaction.down_payment || 0), 0);
  const totalOutstandingBalance = transactionData.reduce((acc, transaction) => acc + parseFloat(transaction.outstanding_balance || 0), 0);

  return (
    <section>
      <h2 className="text-xl font-semibold">Transaction History</h2>
      {transactionData.length === 0 ? (
        <p>No transaction history available.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded mb-4 text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-2 px-2 sm:px-4">Invoice ID</th>
              <th className="py-2 px-2 sm:px-4">Transaction Date</th>
              <th className="py-2 px-2 sm:px-4">Item Purchased</th>
              <th className="py-2 px-2 sm:px-4">Quantity</th>
              <th className="py-2 px-2 sm:px-4">Total Amount</th>
              <th className="py-2 px-2 sm:px-4">Down Payment</th>
              <th className="py-2 px-2 sm:px-4">Outstanding Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="py-2 px-2 sm:px-4">{transaction.invoice_id}</td>
                <td className="py-2 px-2 sm:px-4">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td className="py-2 px-2 sm:px-4">{transaction.item || 'N/A'}</td> {/* Updated to use 'item' */}
                <td className="py-2 px-2 sm:px-4">{transaction.quantity}</td>
                <td className="py-2 px-2 sm:px-4">{parseFloat(transaction.total_amount).toFixed(2)}</td>
                <td className="py-2 px-2 sm:px-4">{parseFloat(transaction.down_payment).toFixed(2)}</td>
                <td className="py-2 px-2 sm:px-4">{parseFloat(transaction.outstanding_balance).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-100">
              <td colSpan="4" className="py-2 px-2 sm:px-4">Total</td>
              <td className="py-2 px-2 sm:px-4">{totalAmount.toFixed(2)}</td>
              <td className="py-2 px-2 sm:px-4">{totalDownPayment.toFixed(2)}</td>
              <td className="py-2 px-2 sm:px-4">{totalOutstandingBalance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </section>
  );
};

export default TransactionHistory;
