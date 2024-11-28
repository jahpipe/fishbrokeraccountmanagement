import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTransactionDetails from '../DashboardComponents/UserTransactionDetails'; // Import UserTransactionDetails component

const Invoice = () => {
  const [users, setUsers] = useState([]);
  const [fishNames, setFishNames] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedFish, setSelectedFish] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [pricePerKg, setPricePerKg] = useState(0);
  const [items, setItems] = useState([]);
  const [initialPayment, setInitialPayment] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [invoiceVisible, setInvoiceVisible] = useState(false);

  // Date and Time
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentWeek, setCurrentWeek] = useState('');

  useEffect(() => {
    const now = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    setCurrentDate(now.toLocaleDateString());
    setCurrentTime(now.toLocaleTimeString());
    setCurrentWeek(daysOfWeek[now.getDay()]);

    // Fetch users and fish names from the backend
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users`);
        setUsers(usersResponse.data);
        
        const fishResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/fishnames`);
        setFishNames(fishResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update pricePerKg when selectedFish changes
    if (selectedFish) {
      const fish = fishNames.find(f => f.id === parseInt(selectedFish, 10));
      if (fish) {
        setPricePerKg(fish.current_price);
      }
    }
  }, [selectedFish, fishNames]);

  useEffect(() => {
    // Update totalAmount when items change
    setTotalAmount(items.reduce((total, item) => total + item.lineTotal, 0));
  }, [items]);

  const handleAddItem = () => {
    if (selectedFish && quantity > 0 && pricePerKg > 0) {
      const fish = fishNames.find(f => f.id === parseInt(selectedFish, 10));
      if (fish) {
        const lineTotal = quantity * pricePerKg;
        setItems(prevItems => {
          const updatedItems = prevItems.filter(item => item.productId !== fish.id);
          return [...updatedItems, {
            productId: fish.id,
            productName: fish.name,
            quantity,
            unitPrice: pricePerKg,
            lineTotal
          }];
        });
        setQuantity(0); // Reset the quantity
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents form from reloading the page

    if (!selectedUser || !items.length) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Create or update invoice
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoices`, {
        userId: selectedUser,
        invoiceDate: currentDate,
        dueDate: '', // Set this as needed
        totalAmount,
        status: 'Pending',
        items
      });

      console.log('Invoice created:', response.data);
      setInvoiceVisible(true);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('An error occurred while creating the invoice.');
    }
  };

  const calculateDiscountedTotal = (total, discount) => {
    return total - (total * (discount / 100));
  };

  const calculateBalanceDue = (total, initialPayment) => {
    return total - initialPayment;
  };

  const user = users.find(u => u.id === parseInt(selectedUser, 10));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-gray-700 mb-1">Select User:</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">-- Select User --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.fullName.split(' ')[0]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Select Fish:</label>
            <select
              value={selectedFish}
              onChange={(e) => setSelectedFish(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">-- Select Fish --</option>
              {fishNames.map(fish => (
                <option key={fish.id} value={fish.id}>{fish.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-gray-700 mb-1">Quantity (kg):</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Price per kg:</label>
            <input
              type="number"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Invoice Items</h2>
          <ul className="border border-gray-300 rounded-md">
            {items.map((item, index) => (
              <li key={index} className="flex justify-between border-b py-2 px-4">
                <span>{item.productName} (x{item.quantity})</span>
                <span>₱{item.lineTotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-gray-700 mb-1">Total Amount:</label>
            <input
              type="number"
              value={totalAmount}
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Discount (%):</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Initial Payment:</label>
          <input
            type="number"
            value={initialPayment}
            onChange={(e) => setInitialPayment(parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2"
            min="0"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button type="button" onClick={handleAddItem} className="bg-blue-500 text-white py-2 px-4 rounded">Add Item</button>
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">Submit Invoice</button>
        </div>
      </form>

      {invoiceVisible && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Invoice Summary</h2>
          <p>Date: {currentDate}</p>
          <p>Time: {currentTime}</p>
          <p>Week: {currentWeek}</p>
          <p>User: {user ? user.fullName.split(' ')[0] : 'N/A'}</p>
          <p>Total Amount: ₱{totalAmount.toFixed(2)}</p>
          <p>Discount: {discount}%</p>
          <p>Total After Discount: ₱{calculateDiscountedTotal(totalAmount, discount).toFixed(2)}</p>
          <p>Initial Payment: ₱{initialPayment.toFixed(2)}</p>
          <p>Balance Due: ₱{calculateBalanceDue(calculateDiscountedTotal(totalAmount, discount), initialPayment).toFixed(2)}</p>
          <button onClick={handlePrint} className="bg-gray-500 text-white py-2 px-4 rounded">Print Invoice</button>
        </div>
      )}

      {selectedUser && <UserTransactionDetails userId={selectedUser} />}
    </div>
  );
};

export default Invoice;
