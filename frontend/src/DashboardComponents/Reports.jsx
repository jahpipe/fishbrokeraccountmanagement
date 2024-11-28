import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Component for displaying summary items
const SummaryCard = ({ title, value, bgColor, textColor, isEntry }) => (
  <div className={`p-4 ${bgColor} rounded-lg shadow`}>
    <h3 className="text-lg font-medium">{title}</h3>
    <p className={`text-2xl font-bold ${textColor}`}>
      {isEntry ? value : `₱${typeof value === 'number' ? value.toFixed(2) : '0.00'}`}
    </p>
  </div>
);

// Payable Summary Component
const PayableSummary = ({ payableSummary, totals }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h1 className="text-2xl font-semibold mb-4 border-b pb-2">Payable Summary</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SummaryCard
        title="Final Payable"
        value={parseFloat(payableSummary.final_payable)}
        bgColor="bg-green-200"
        textColor="text-green-600"
      />
      <SummaryCard
        title="Total Paid"
        value={parseFloat(payableSummary.total_paid)}
        bgColor="bg-blue-200"
        textColor="text-blue-600"
      />
      <SummaryCard
        title="Total Unpaid"
        value={parseFloat(payableSummary.total_unpaid)}
        bgColor="bg-yellow-200"
        textColor="text-yellow-600"
      />
      <SummaryCard
        title="Total Entries"
        value={totals.entries}
        bgColor="bg-red-200"
        textColor="text-red-600"
        isEntry={true}
      />
    </div>
  </div>
);

// Sales Summary Component
const SalesSummary = ({ totals }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
    <h1 className="text-2xl font-semibold mb-4 border-b pb-2">Sales Summary</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SummaryCard
        title="Total Credits"
        value={totals.credits}
        bgColor="bg-green-200"
        textColor="text-green-600"
      />
      <SummaryCard
        title="Total Debits"
        value={totals.debits}
        bgColor="bg-blue-200"
        textColor="text-blue-600"
      />
      <SummaryCard
        title="Outstanding Balance"
        value={totals.outstanding}
        bgColor="bg-yellow-200"
        textColor="text-yellow-600"
      />
      <SummaryCard
        title="Total Entries"
        value={totals.entries}
        bgColor="bg-red-200"
        textColor="text-red-600"
        isEntry={true}
      />
    </div>
  </div>
);

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [totals, setTotals] = useState({ credits: 0, debits: 0, outstanding: 0, entries: 0 });
  const [error, setError] = useState(null);
  const [summaryDate, setSummaryDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today for end date

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/summaryreport?date=${summaryDate}`);
      console.log('Fetched summary:', response.data);
      setSummary(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err.message);
      setSummary(null);
    }
  };

  const fetchTotals = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/salesreport?start_date=${summaryDate}&end_date=${endDate}`);
      console.log('Fetched sales totals response:', response.data);

      // Initialize totals
      let totalCredits = 0;
      let totalDebits = 0;
      let totalOutstanding = 0;

      // Ensure response data is valid
      if (Array.isArray(response.data) && response.data.length > 0) {
        response.data.forEach(invoice => {
          totalCredits += parseFloat(invoice.sale_total) || 0; // Assuming sale_total is used for credits
          totalDebits += parseFloat(invoice.paid_amount) || 0; // Assuming paid_amount is used for debits
          totalOutstanding += parseFloat(invoice.outstanding_balance) || 0; // Assuming outstanding_balance is for outstanding
        });
      } else {
        console.log('No sales data found for the given date range');
      }

      // Update state with calculated totals
      setTotals({
        credits: totalCredits,
        debits: totalDebits,
        outstanding: totalOutstanding,
        entries: response.data.length // Count of total entries
      });

      console.log('Total Credits:', totalCredits);
      console.log('Total Debits:', totalDebits);
      console.log('Total Outstanding:', totalOutstanding);
      console.log('Total Entries:', response.data.length);

    } catch (err) {
      console.error('Error fetching sales totals:', err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTotals(); // Fetch totals whenever summaryDate or endDate changes
  }, [summaryDate, endDate]);

  const handleSummaryDateChange = (date) => {
    setSummaryDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Summary Reports</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-6 text-center">
        <input
          type="date"
          value={summaryDate}
          onChange={(e) => handleSummaryDateChange(e.target.value)}
          className="border rounded p-2 mr-4"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {summary ? (
        <>
          <PayableSummary 
            payableSummary={summary.payable_summary} 
            totals={totals} 
          />
          <SalesSummary 
            totals={totals} 
          />
        </>
      ) : (
        <p className="text-gray-600 text-center mt-4">Loading summary report...</p>
      )}
    </div>
  );
};

export default Reports;
