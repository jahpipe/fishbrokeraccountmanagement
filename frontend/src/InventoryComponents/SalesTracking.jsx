import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components from Chart.js
Chart.register(...registerables);

const formatCurrency = (amount) => {
    return `₱ ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

const SalesTracking = () => {
    const [salesData, setSalesData] = useState([]);
    const [totals, setTotals] = useState({ credits: 0, debits: 0, outstanding: 0 });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchSalesData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/sales?start_date=${startDate}&end_date=${endDate}`);
            setSalesData(response.data);

            const totalCredits = response.data.reduce((sum, sale) => sum + parseFloat(sale.sale_total || 0), 0);
            const totalDebits = response.data.reduce((sum, sale) => sum + parseFloat(sale.paid_amount || 0), 0);
            const totalOutstanding = response.data.reduce((sum, sale) => sum + parseFloat(sale.outstanding_balance || 0), 0);

            setTotals({ credits: totalCredits, debits: totalDebits, outstanding: totalOutstanding });
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, [startDate, endDate]);

    // Prepare chart data
    const chartData = {
        labels: salesData.map(sale => sale.customer_name), // Adjust as needed
        datasets: [
            {
                label: 'Total Sales',
                data: salesData.map(sale => parseFloat(sale.sale_total)), // Adjust as needed
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Sales Tracking</h1>
            <div className="flex flex-col md:flex-row md:justify-between mb-6">
                <div className="mb-4 w-full md:w-1/2">
                    <label className="block text-gray-700 mb-1">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4 w-full md:w-1/2">
                    <label className="block text-gray-700 mb-1">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Total Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center bg-green-100 p-4 rounded-lg shadow">
                        <h3 className="text-lg">Total Credits</h3>
                        <p className="text-3xl font-bold text-green-600">{formatCurrency(totals.credits)}</p>
                    </div>
                    <div className="text-center bg-red-100 p-4 rounded-lg shadow">
                        <h3 className="text-lg">Total Debits</h3>
                        <p className="text-3xl font-bold text-red-600">{formatCurrency(totals.debits)}</p>
                    </div>
                    <div className="text-center bg-blue-100 p-4 rounded-lg shadow">
                        <h3 className="text-lg">Outstanding Balance</h3>
                        <p className="text-3xl font-bold text-blue-600">{formatCurrency(totals.outstanding)}</p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sales Chart</h2>
                <Bar data={chartData} />
            </div>

            <div className="overflow-x-auto">
                <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                    <table className="min-w-full border border-gray-300 bg-white shadow rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Customer Name</th>
                                <th className="border border-gray-300 p-2">Date Purchase</th>
                                <th className="border border-gray-300 p-2">Due Date</th>
                                <th className="border border-gray-300 p-2">Product Name</th>
                                <th className="border border-gray-300 p-2">Quantity</th>
                                <th className="border border-gray-300 p-2">Sale Total</th>
                                <th className="border border-gray-300 p-2">Paid Amount</th>
                                <th className="border border-gray-300 p-2">Outstanding Balance</th>
                                <th className="border border-gray-300 p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData.map((sale, index) => (
                                <tr key={sale.invoice_id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                    <td className="border border-gray-300 p-2">{sale.customer_name}</td>
                                    <td className="border border-gray-300 p-2">{formatDate(sale.date_purchase)}</td>
                                    <td className={`border border-gray-300 p-2 ${new Date(sale.due_date) < new Date() ? 'text-red-500' : ''}`}>
                                        {formatDate(sale.due_date)}
                                    </td>
                                    <td className="border border-gray-300 p-2">{sale.product_name}</td>
                                    <td className="border border-gray-300 p-2">{sale.quantity}</td>
                                    <td className="border border-gray-300 p-2">{formatCurrency(sale.sale_total)}</td>
                                    <td className="border border-gray-300 p-2">{formatCurrency(sale.paid_amount)}</td>
                                    <td className="border border-gray-300 p-2">{formatCurrency(sale.outstanding_balance)}</td>
                                    <td className={`border border-gray-300 p-2 ${parseFloat(sale.outstanding_balance) === 0 ? 'bg-green-100 text-green-700 font-bold' : parseFloat(sale.outstanding_balance) > 0 ? 'bg-red-100 text-red-700 font-bold' : ''}`}>
                                        {parseFloat(sale.outstanding_balance) === 0 ? 'Paid' : 'Pending'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr className="bg-gray-200 font-bold">
                                <td colSpan={5} className="border border-gray-300 p-2 text-right">Total</td>
                                <td className="border border-gray-300 p-2">{formatCurrency(totals.credits)}</td>
                                <td className="border border-gray-300 p-2">{formatCurrency(totals.debits)}</td>
                                <td className="border border-gray-300 p-2">{formatCurrency(totals.outstanding)}</td>
                                <td className="border border-gray-300 p-2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesTracking;
