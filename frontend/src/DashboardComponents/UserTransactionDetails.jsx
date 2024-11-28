import React from 'react';

const UserTransactionDetails = ({ onClose }) => {
  // Sample data
  const transactions = [
    {
      id: 'T001',
      user_id: 'U001',
      invoice_id: 'INV001',
      transaction_date: '2024-09-01',
      item_purchased: 'Fish A',
      quantity: 10,
      amount_paid: 5000,
      down_payment: 2000,
      outstanding_balance: 2000,
    },
    {
      id: 'T002',
      user_id: 'U002',
      invoice_id: 'INV002',
      transaction_date: '2024-09-05',
      item_purchased: 'Fish B',
      quantity: 15,
      amount_paid: 6000,
      down_payment: 3000,
      outstanding_balance: 3000,
    },
    // Add more transactions as needed
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Invoice ID</th>
              <th className="border px-4 py-2">Transaction Date</th>
              <th className="border px-4 py-2">Item Purchased</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Amount Paid</th>
              <th className="border px-4 py-2">Down Payment</th>
              <th className="border px-4 py-2">Outstanding Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td className="border px-4 py-2">{tx.id}</td>
                <td className="border px-4 py-2">{tx.user_id}</td>
                <td className="border px-4 py-2">{tx.invoice_id}</td>
                <td className="border px-4 py-2">{tx.transaction_date}</td>
                <td className="border px-4 py-2">{tx.item_purchased}</td>
                <td className="border px-4 py-2">{tx.quantity}</td>
                <td className="border px-4 py-2">₱{tx.amount_paid.toFixed(2)}</td>
                <td className="border px-4 py-2">₱{tx.down_payment.toFixed(2)}</td>
                <td className="border px-4 py-2">₱{tx.outstanding_balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={onClose}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Close
      </button>
    </div>
  );
};

export default UserTransactionDetails;
