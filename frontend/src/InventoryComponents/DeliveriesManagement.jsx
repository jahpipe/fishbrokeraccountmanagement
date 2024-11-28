import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const getDayOfWeek = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = new Date(date).getDay();
  return days[dayIndex];
};

const StockManagementSystem = () => {
  const [products, setProducts] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [stockBalance, setStockBalance] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockInResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products`);
        const stockOutResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/stockout`);
        
        setStockIn(stockInResponse.data);
        setStockOut(stockOutResponse.data);
        setProducts(stockInResponse.data);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  // Filter products by the selected date
  const filteredProducts = selectedDate
    ? products.filter(product => {
        const productDate = new Date(product.arrival_date);
        return productDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  // Group products by day of the week
  const productsByDay = products.reduce((acc, product) => {
    const day = getDayOfWeek(product.arrival_date);
    if (!acc[day]) acc[day] = [];
    acc[day].push(product);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            className="px-4 py-2 border border-gray-300 rounded-lg"
            placeholderText="Select a date to filter"
          />
        </div>

        {selectedDate && (
          <div className="mb-6">
            <h6 className="text-xl font-semibold mb-4 text-blue-800">
              Deliveries for {selectedDate.toDateString()}
            </h6>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="p-4 text-left">Product Name</th>
                  <th className="p-4 text-left">Kilo</th>
                  <th className="p-4 text-left">Current Price</th>
                  <th className="p-4 text-left">Arrival Date</th>
                  <th className="p-4 text-left">Arrival Time</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">{product.product_name}</td>
                    <td className="p-4">{product.kilo}</td>
                    <td className="p-4">
                      {Number(product.current_price).toFixed(2)}
                    </td>
                    <td className="p-4">{new Date(product.arrival_date).toLocaleDateString()}</td>
                    <td className="p-4">{product.arrival_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">
            {selectedDate ? `No deliveries found for ${selectedDate.toDateString()}.` : 'Please select a date to see deliveries.'}
          </p>
        )}

        {/* Display deliveries for each day of the week */}
        <div className="mt-8">
          <h6 className="text-2xl font-semibold mb-4 text-gray-900">All Deliveries by Day</h6>
          {Object.keys(productsByDay).map(day => (
            <section key={day} className="mb-10">
              <h6 className="text-xl font-semibold mb-4 text-blue-800 border-b-2 border-blue-300 pb-2">
                {day}
              </h6>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                  <thead className="bg-blue-100 text-blue-800">
                    <tr>
                      <th className="p-4 text-left">Product Name</th>
                      <th className="p-4 text-left">Kilo</th>
                      <th className="p-4 text-left">Current Price</th>
                      <th className="p-4 text-left">Arrival Date</th>
                      <th className="p-4 text-left">Arrival Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {productsByDay[day].map((product, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">{product.product_name}</td>
                        <td className="p-4">{product.kilo}</td>
                        <td className="p-4">
                          {Number(product.current_price).toFixed(2)}
                        </td>
                        <td className="p-4">{new Date(product.arrival_date).toLocaleDateString()}</td>
                        <td className="p-4">{product.arrival_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockManagementSystem;
