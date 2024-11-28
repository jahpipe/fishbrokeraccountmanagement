import React, { useState, useEffect } from "react";
import axios from 'axios';
import Account_payable from "./Account_payable";

const formatCurrency = (amount) => {
  if (isNaN(amount)) return '₱0.00';
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Math.abs(amount));
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US').format(new Date(date));
};

const ViewLedgers = () => {
  const [activeTab, setActiveTab] = useState("accountsReceivable");
  const [filters, setFilters] = useState({
    filterPeriod: "all",
    startDate: "",
    endDate: "",
    selectedCustomer: "",
    selectedInvoice: "" // Keep as a single invoice
  });
  const [arData, setArData] = useState([]);
  const [arTransactions, setArTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const arResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/ar-transactions`);
        setArData(arResponse.data);
        setLoading(false);
      } catch (error) {
        setError(`Error fetching data from server: ${error.message}`);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch transactions for the selected invoice
  useEffect(() => {
    const fetchTransactionsByInvoice = async (invoiceId) => {
      try {
        const transactionsResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/ar-transactions?invoiceId=${invoiceId}`);
        setArTransactions(transactionsResponse.data);
      } catch (error) {
        setError(`Error fetching transactions: ${error.message}`);
      }
    };

    if (filters.selectedInvoice) {
      fetchTransactionsByInvoice(filters.selectedInvoice);
    } else {
      setArTransactions([]);
    }
  }, [filters.selectedInvoice]);

  // Filter accounts receivable data based on selected customer
  const filteredAR = arData.filter((ar) => {
    const matchesCustomer = !filters.selectedCustomer || ar.customerName === filters.selectedCustomer;
    return matchesCustomer;
  });

  const customers = [...new Set(arData.map((ar) => ar.customerName))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  // Initialize balance before transactions map
  let runningBalance = 0;

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <header className="bg-blue-600 text-white text-2xl font-bold py-4 text-center">
        Ledger
      </header>
      <div className="p-4 md:p-6">
        <div className="bg-white shadow-md rounded-lg mb-6 p-4">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button
                className={`px-4 py-2 ${activeTab === "accountsReceivable" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded hover:bg-blue-400`}
                onClick={() => setActiveTab("accountsReceivable")}
              >
                Accounts Receivable
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "accountsPayable" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded hover:bg-blue-400`}
                onClick={() => setActiveTab("accountsPayable")}
              >
                Accounts Payable
              </button>
            </div>
          </div>

          {activeTab === "accountsReceivable" && (
            <div className="mb-4">
              <label className="mr-2">Filter by Customer:</label>
              <select
                className="px-3 py-1 border rounded w-full md:w-auto"
                name="selectedCustomer"
                value={filters.selectedCustomer}
                onChange={handleFilterChange}
              >
                <option value="">All Customers</option>
                {customers.map((customer, index) => (
                  <option key={index} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === "accountsPayable" && (
            <div>
              <Account_payable />
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          {activeTab === "accountsReceivable" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Accounts Receivable</h2>
              {filteredAR.length > 0 && (
                <div className="mb-4">
                  <label className="mr-2">Select Invoice:</label>
                  <select
                    className="px-3 py-1 border rounded w-full md:w-auto"
                    name="selectedInvoice"
                    value={filters.selectedInvoice}
                    onChange={handleFilterChange}
                    >
                    <option value="">Select an invoice</option>
                    {Array.from(new Set(filteredAR.map(ar => ar.invoice_id))).map((invoiceId) => {
                      return (
                        <option key={invoiceId} value={invoiceId}>
                          {`Invoice ID: ${invoiceId}`}  {/* Removed total amount from here */}
                        </option>
                      );
                    })}
                  </select>

                </div>
              )}

              {/* Display transactions for selected invoice */}
              {filters.selectedInvoice && (
                <div>
                  {arTransactions.length === 0 ? (
                    <p>No transactions available for the selected invoice.</p>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Transactions for Invoice ID: {filters.selectedInvoice}
                      </h3>

                      {/* Responsive Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse mb-4">
                          <thead>
                            <tr className="bg-blue-100 text-gray-800">
                              <th className="border p-2">Date</th>
                              <th className="border p-2">Particulars</th>
                              <th className="border p-2">Debit Amount</th>
                              <th className="border p-2">Credit Amount</th>
                              <th className="border p-2">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {arTransactions
                              .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)) // Sort transactions by date
                              .map((transaction, index) => {
                                // For each row, calculate balance as debit - credit
                                const newBalance = Number(transaction.debit_amount) - Number(transaction.credit_amount);
                                // Calculate cumulative balance
                                runningBalance += newBalance;

                                return (
                                  <tr key={index}>
                                    <td className="border p-2">{formatDate(transaction.transaction_date)}</td>
                                    <td className="border p-2">{transaction.particulars || 'N/A'}</td>
                                    <td className="border p-2">{formatCurrency(transaction.debit_amount)}</td>
                                    <td className="border p-2">{formatCurrency(transaction.credit_amount)}</td>
                                    <td className="border p-2">{formatCurrency(runningBalance)}</td>
                                  </tr>
                                );
                              })}

                            <tr className="font-bold">
                              <td colSpan="2" className="border p-2">Total</td>
                              <td className="border p-2">
                                {formatCurrency(arTransactions.reduce((acc, t) => acc + Number(t.debit_amount), 0))}
                              </td>
                              <td className="border p-2">
                                {formatCurrency(arTransactions.reduce((acc, t) => acc + Number(t.credit_amount), 0))}
                              </td>
                              <td className="border p-2">{formatCurrency(runningBalance)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLedgers;
