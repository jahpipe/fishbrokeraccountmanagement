import React, { useState, useEffect } from 'react';
import axios from 'axios';

const statusStyles = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Overdue: 'bg-red-100 text-red-800',
};

const ManageInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState({});
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [payment, setPayment] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [arTransactions, setArTransactions] = useState([]);
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesResponse, usersResponse, productsResponse, arTransactionsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoices`),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users`),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products`),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/ar-transactions`),
        ]);

        const invoicesData = invoicesResponse.data;
        const usersData = usersResponse.data.reduce((acc, user) => {
          acc[user.id] = user.fullName;
          return acc;
        }, {});

        const productsData = productsResponse.data.reduce((acc, product) => {
          acc[product.product_id] = product;
          return acc;
        }, {});

        const groupedInvoices = invoicesData.reduce((acc, invoice) => {
          const userName = usersData[invoice.user_id] || 'Unknown User';
          if (!acc[userName]) acc[userName] = [];
          acc[userName].push(invoice);
          return acc;
        }, {});

        Object.keys(groupedInvoices).forEach(userName => {
          groupedInvoices[userName].sort((a, b) => new Date(b.invoice_date) - new Date(a.invoice_date));
        });

        setInvoices(invoicesData.filter(invoice => invoice.is_active));
        setFilteredInvoices(groupedInvoices);
        setUsers(usersData);
        setProducts(productsData);

        // Fetch transactions for each user
        const transactionsResponses = await Promise.all(
          Object.keys(usersData).map(userId =>
            axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/transactions?userId=${userId}`)
          )
        );

        const transactionsData = transactionsResponses.reduce((acc, response, index) => {
          const userId = Object.keys(usersData)[index];
          acc[usersData[userId]] = response.data;
          return acc;
        }, {});

        setTransactions(transactionsData);

        // Set AR transactions data
        const arTransactionsData = arTransactionsResponse.data;
        setArTransactions(arTransactionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      const groupedInvoices = invoices.reduce((acc, invoice) => {
        const userName = users[invoice.user_id] || 'Unknown User';
        if (!acc[userName]) acc[userName] = [];
        acc[userName].push(invoice);
        return acc;
      }, {});
      setFilteredInvoices(groupedInvoices);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const groupedInvoices = invoices.reduce((acc, invoice) => {
        const userName = users[invoice.user_id] || 'Unknown User';
        if (userName.toLowerCase().includes(lowercasedSearchTerm)) {
          if (!acc[userName]) acc[userName] = [];
          acc[userName].push(invoice);
        }
        return acc;
      }, {});
      setFilteredInvoices(groupedInvoices);
    }
  }, [searchTerm, invoices, users]);

  const toggleSection = (userName, section) => {
    if (section === 'invoices') {
      setExpandedUser(prev => (prev === userName ? null : userName));
    } else if (section === 'transaction') {
      setExpandedTransaction(prev => (prev === userName ? null : userName));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
        console.error("Invalid Date Format: undefined");
        return "N/A"; // Return a placeholder or default value
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error("Invalid Date Format:", dateString);
        return "N/A"; // Return a placeholder or default value
    }

    // Format the date as desired (e.g., MM/DD/YYYY)
    return date.toLocaleDateString(); // This will format based on user's locale
};


  

  const handlePaymentChange = (invoiceId, amount) => {
    setPayment(prev => ({ ...prev, [invoiceId]: amount }));
  };

  const fetchTransactions = async () => {
    try {
        const transactionsResponses = await Promise.all(
            Object.keys(users).map(userId =>
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/transactions?userId=${userId}`)
            )
        );

        const transactionsData = transactionsResponses.reduce((acc, response, index) => {
            const userId = Object.keys(users)[index];
            acc[users[userId]] = response.data;
            return acc;
        }, {});

        setTransactions(transactionsData); // Assuming setTransactions is defined in your component
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};


  const handlePaymentSubmit = async (invoice) => {
  const paymentAmount = parseFloat(payment[invoice.id] || 0);
  const initialPaymentAmount = parseFloat(invoice.initial_payment || 0);
  const balanceDue = calculateBalanceDue(invoice.total_amount, initialPaymentAmount + invoice.paid_amount);

  if (paymentAmount <= 0 || paymentAmount > balanceDue) {
    alert('Invalid payment amount.');
    return;
  }

  const confirmSubmit = window.confirm('Are you sure you want to submit this payment?');
  if (!confirmSubmit) return;

  // Set the payment as submitted but awaiting confirmation or cancellation
  setIsPaymentSubmitted(true);
};

const handleConfirmPayment = async (invoice) => {
  try {
    const paymentAmount = parseFloat(payment[invoice.id] || 0);
    const updatedPaidAmount = parseFloat(invoice.paid_amount || 0) + paymentAmount;
    const updatedStatus = updatedPaidAmount >= invoice.total_amount ? 'Paid' : 'Pending';

    // Update the invoice
    await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoices/${invoice.id}`, {
      paid_amount: updatedPaidAmount,
      status: updatedStatus,
    });

    // Update the accounts_receivable
    await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/accounts_receivable/${invoice.id}`, {
      paid_amount: updatedPaidAmount,
      outstanding_balance: invoice.total_amount - updatedPaidAmount,
    });

    // Update local state
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => inv.id === invoice.id ? { ...inv, paid_amount: updatedPaidAmount, status: updatedStatus } : inv)
    );

    const userName = users[invoice.user_id] || 'Unknown User';
    setFilteredInvoices(prevFilteredInvoices => ({
      ...prevFilteredInvoices,
      [userName]: prevFilteredInvoices[userName].map(inv => inv.id === invoice.id ? { ...inv, paid_amount: updatedPaidAmount, status: updatedStatus } : inv),
    }));

    // Clear the payment input
    setPayment(prev => ({ ...prev, [invoice.id]: '' }));

    // Reset isPaymentSubmitted to false
    setIsPaymentSubmitted(false);

    // Fetch updated transactions
    await fetchTransactions();

    alert('Payment successfully confirmed and account receivable updated!');
  } catch (error) {
    console.error('Payment confirmation error:', error);
    alert(`Failed to confirm payment: ${error.message || 'Unknown error'}`);
  }
};

const handleCancelPayment = (invoiceId) => {
  // Reset the payment amount and hide confirm/cancel options
  setPayment(prevPayment => ({
    ...prevPayment,
    [invoiceId]: ''
  }));
  setIsPaymentSubmitted(false);  
};

  const calculateBalanceDue = (total, initialPayment) => total - initialPayment;


  const handlePrintReceipt = (invoice) => {
    const userName = users[invoice.user_id] || 'Unknown User';

    // Helper function to safely parse and format numbers
    const safeToFixed = (value, decimals = 2) => {
        const numberValue = parseFloat(value);
        if (isNaN(numberValue)) {
            console.error('Value is not a number:', value);
            return '0.00';
        }
        return numberValue.toFixed(decimals);
    };

    // Calculate Balance
    const totalAmount = safeToFixed(invoice.total_amount);
    const amountPaid = safeToFixed(invoice.paid_amount);
    const balance = safeToFixed(
        parseFloat(totalAmount) - parseFloat(amountPaid)
    );

    // Build receipt content
    const receiptContent = generateLeftAlignedReceipt(userName, totalAmount, amountPaid, balance);

    // Open new window for printing
    printReceipt(receiptContent);
};

// Function to generate left-aligned receipt content for thermal printer
const generateLeftAlignedReceipt = (userName, totalAmount, amountPaid, balance) => `
    =================================      ANU FISH BROKER
  Baybay City
Tel: 696969696
    =================================
            Customer: ${userName}
    ---------------------------------
                 Total  : ₱${totalAmount}
                 Paid   : ₱${amountPaid}
                 Balance: ₱${balance}
    ---------------------------------
            Payment Method:
                Cash
    ================================= 
    Thank you for your payment!
Please  come again!
    =================================
`;

// Function to open a new window and print receipt
const printReceipt = (content) => {
    const newWindow = window.open('', '', 'width=300,height=400');
    newWindow.document.write(`
      <pre style="font-family: monospace; white-space: pre-wrap; text-align: left;">${content}</pre>
    `);
    newWindow.document.close();
    newWindow.print();
};


  
  if (loading) return <div className="text-center text-blue-500">Loading...</div>;

 return (
  <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Manage Invoices</h1>
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by user name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full md:w-1/2"
      />
    </div>
    {Object.keys(filteredInvoices).length === 0 ? (
      <p className="text-center">No invoices found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.keys(filteredInvoices).map(userName => (
              <React.Fragment key={userName}>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {userName} ({filteredInvoices[userName].length} invoices)
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => toggleSection(userName, 'invoices')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                    >
                      {expandedUser === userName ? 'Hide Invoices' : 'Show Invoices'}
                    </button>
                    <button
                      onClick={() => toggleSection(userName, 'transaction')}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      {expandedTransaction === userName ? 'Hide Transactions' : 'Show Transactions'}
                    </button>
                  </td>
                </tr>

                {expandedUser === userName && (
                  <tr>
                    <td colSpan="2">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 mt-2">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice Date</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid Amount</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInvoices[userName].map(invoice => {
                              const invoiceTransactions = (transactions[userName] || []).filter(transaction => transaction.invoice_id === invoice.id);
                              const balanceDue = calculateBalanceDue(invoice.total_amount, (invoice.initial_payment || 0) + (invoice.paid_amount || 0));

                              return (
                                <React.Fragment key={invoice.id}>
                                  <tr>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{invoice.id}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.due_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₱{Number(invoice.total_amount || 0).toFixed(2)}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₱{Number(invoice.paid_amount || 0).toFixed(2)}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                      <span className={`${statusStyles[invoice.status]} px-2 py-1 rounded-full text-xs font-medium`}>
                                        {invoice.status}
                                      </span>
                                    </td>
                                  </tr>

                                  {invoiceTransactions.map(transaction => (
  <tr key={transaction.id}>
    <td colSpan="7">
      <div className="flex items-center justify-between bg-white border border-gray-300 shadow-md rounded-lg p-4 mt-2">
        
        {/* Left Section: Item & Balance Due */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800">
            Item: {transaction.item || 'Unknown Item'}
          </h4>
          <p className="text-sm font-medium text-gray-600">
            Balance Due: ₱{balanceDue.toFixed(2)}
          </p>
        </div>

        {/* Right Section: Payment Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Payment Input Field */}
          <input
            type="number"
            placeholder="Payment Amount"
            value={payment[invoice.id] || ''}
            onChange={(e) => handlePaymentChange(invoice.id, e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Submit Payment Button */}
          <button
            onClick={() => handlePaymentSubmit(invoice)}
            className="bg-green-500 text-white font-semibold rounded-md py-2 px-3 hover:bg-green-600 transition"
          >
            Submit
          </button>

          {/* Confirm & Cancel Buttons */}
          {isPaymentSubmitted && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleConfirmPayment(invoice)}
                className="bg-blue-500 text-white font-semibold rounded-md py-2 px-3 hover:bg-blue-600 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => handleCancelPayment(invoice)}
                className="bg-red-500 text-white font-semibold rounded-md py-2 px-3 hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Print Receipt Button */}
          <button
            onClick={() => handlePrintReceipt(invoice)}
            className="bg-indigo-500 text-white font-semibold rounded-md py-2 px-3 hover:bg-indigo-600 transition"
          >
            Print
          </button>
        </div>
      </div>
    </td>
  </tr>
))}

                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}

                {expandedTransaction === userName && transactions[userName] && (
                  <tr>
                    <td colSpan="2">
                      <div className="overflow-x-auto">
                        <div className="p-4 bg-gray-100 rounded-lg mt-2">
                          <h3 className="text-lg font-semibold mb-2">Transactions for {userName}</h3>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Down Payment</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Outstanding Balance</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {transactions[userName].map(transaction => (
                                <tr key={transaction.id}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.id}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.invoice_id}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.transaction_date)}</td>
                                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.item}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.quantity}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₱{Number(transaction.total_amount).toFixed(2)}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₱{Number(transaction.down_payment).toFixed(2)}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₱{Number(transaction.outstanding_balance).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

};

export default ManageInvoices;
