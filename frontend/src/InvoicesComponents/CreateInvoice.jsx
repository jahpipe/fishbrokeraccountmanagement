import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateInvoice = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]); // Pinalitan ang fishNames ng products
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(''); // Pinalitan ang selectedFish ng selectedProduct
  const [quantity, setQuantity] = useState(0);
  const [pricePerKg, setPricePerKg] = useState(0);
  const [items, setItems] = useState([]);
  const [initialPayment, setInitialPayment] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [creatorName, setCreatorName] = useState('Admin'); // Assuming "Admin" is the default creator
  const [selectedItemForPayment, setSelectedItemForPayment] = useState('');

  useEffect(() => {
    // Set current date with local timezone consideration
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-CA'); // yyyy-mm-dd format
    setCurrentDate(formattedDate);
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersResponse, productsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users`),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products`), // Changed fishnames endpoint to products
        ]);
        setUsers(usersResponse.data);
        setProducts(productsResponse.data); // Maintain fetching products
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  
  useEffect(() => {
    if (selectedProduct) {
      fetchPricePerKg(selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    setTotalAmount(items.reduce((total, item) => total + item.lineTotal, 0));
  }, [items]);

  const fetchPricePerKg = async (productId) => {
    try {
        // Fetch the specific product using its ID
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products/${productId}`);
        
        // Check if the product was found and set the price
        if (response.data && response.data.current_price) {
            setPricePerKg(response.data.current_price);
        } else {
            // If current_price is not found, set a default value
            setPricePerKg(0);
        }
    } catch (error) {
        console.error('Error fetching price:', error);
        alert('Error fetching price. Please try again later.');
        // Optionally set default value in case of error
        setPricePerKg(0);
    }
};


  const handleAddItem = () => {
    if (selectedProduct && quantity > 0 && pricePerKg > 0) {
      const product = products.find(p => p.product_id === parseInt(selectedProduct, 10)); // Pinalitan ang fish sa product

      if (product) {
        const lineTotal = quantity * pricePerKg;
        setItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(item => item.productId === product.product_id); // Pinalitan ang fish.id ng product.product_id
          if (existingItemIndex !== -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity,
              lineTotal
            };
            return updatedItems;
          }
          return [
            ...prevItems,
            {
              productId: product.product_id, // Pinalitan ang fish.id
              productName: product.product_name, // Pinalitan ang fish.name
              quantity,
              unitPrice: pricePerKg,
              lineTotal
            }
          ];
        });
        setQuantity(0); // Reset quantity for the next item
      }
    } else {
      alert('Please select a valid product, and ensure quantity and price are set.'); // Pinalitan ang 'fish' ng 'product'
    }
  };
  
  const handleCancel = (index) => {
    const updatedItems = items.filter((_, i) => i !== index); // Remove item at the specified index
    setItems(updatedItems); // Update the state with the filtered items
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!selectedUser) {
        alert('Please select a user.');
        return;
    }
    if (!items.length) {
        alert('Please add at least one item.');
        return;
    }
    if (!dueDate) {
        alert('Please select a due date.');
        return;
    }

    const validatedTotalAmount = isNaN(totalAmount) ? 0 : parseFloat(totalAmount);

    try {
        setLoading(true);

        // Create invoice data
        const invoiceData = {
            userId: selectedUser,
            invoiceDate: currentDate,
            dueDate: dueDate,
            totalAmount: validatedTotalAmount,
            status: 'Pending',
            createdBy: creatorName,
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineTotal: item.lineTotal,
            })),
            initialPayment: initialPayment || 0,
        };

        // Send invoice to backend
        const invoiceResponse = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoices`, invoiceData);

        const { invoiceIds } = invoiceResponse.data; // Ensure you access invoiceIds array
        if (!invoiceIds || !invoiceIds.length) {
            alert('An error occurred. Invoice ID is missing.');
            return;
        }
        const invoiceId = invoiceIds[0]; // Use the first ID in the array

        // Process initial payment if it's greater than zero
        if (initialPayment > 0) {
            await submitPayment(invoiceId, initialPayment);
        }

        setInvoiceVisible(true); // Show the invoice
    } catch (error) {
        console.error('Error creating invoice:', error);
        alert('An error occurred while creating the invoice.');
    } finally {
        setLoading(false);
    }
};

const resetForm = () => {
  setSelectedUser('');
  setSelectedProduct('');
  setQuantity(0);
  setPricePerKg(0);
  setItems([]);
  setInitialPayment(0);
  setTotalAmount(0);
  setDueDate('');
  setInvoiceVisible(false); 
};

const handleCloseInvoice = () => {
    resetForm(); // Reset form when closing the invoice
    setInvoiceVisible(false);
};

const submitPayment = async (invoiceId, paymentAmount) => {
    try {
        if (!selectedItemForPayment) {
            alert('Please select an item for payment.');
            return;
        }

        const paymentData = {
            invoiceId: invoiceId,
            paymentAmount: paymentAmount,
            itemId: selectedItemForPayment, 
        };


        // Send the payment to the backend
        await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/submit-payment`, paymentData);

        // Update frontend state
        setInitialPayment(prev => prev + paymentAmount);
        setTotalAmount(prev => prev - paymentAmount);

        // Log updated values after the state changes

    } catch (error) {
        console.error('Error processing payment:', error);
        alert('An error occurred while processing the payment.');
    }
};

const calculateBalanceDue = (total, initialPayment) => {
    return total - (initialPayment || 0);
};

const user = users.find(u => u.id === parseInt(selectedUser, 10));

const handlePrint = () => {
  console.log('Invoice Data:', {
    items,
    totalAmount,
    initialPayment,
    balanceDue: calculateBalanceDue(totalAmount, initialPayment),
  });

  window.print(); // Open print dialog

  setTimeout(() => {
    setInvoiceVisible(false); // Hide the invoice after printing
    resetForm(); // Reset the form inputs after printing
  }, 500); // Adjust as necessary
};


  return (
  <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>
    {loading && <div className="text-center text-blue-500">Loading...</div>}

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User and Product Selection */}
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
              <option key={user.id} value={user.id}>{user.fullName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Select Product:</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">-- Select Product --</option>
            {products.map(product => (
              <option key={product.product_id} value={product.product_id}>{product.product_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quantity and Price Input */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
      <label className="block text-gray-700 mb-1">Quantity (kg):</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value === "" ? "" : parseFloat(e.target.value) || 0)}
        className="w-full border border-gray-300 rounded-md p-2"
        step="0.00"
      />
    </div>

        <div>
          <label className="block text-gray-700 mb-1">Price per kg:</label>
          <input
            type="number"
            value={pricePerKg}
            readOnly
            className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
          />
        </div>
      </div>

      {/* Add Item Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>

      {/* Invoice Items Table */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Invoice Items</h2>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Item</th>
                <th className="border border-gray-300 p-2">Quantity</th>
                <th className="border border-gray-300 p-2">Line Total</th>
                <th className="border border-gray-300 p-2">Action</th> {/* New column for Cancel action */}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{item.productName}</td>
                  <td className="border border-gray-300 p-2">{item.quantity} kg</td>
                  <td className="border border-gray-300 p-2">₱{item.lineTotal.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleCancel(index)} // Call handleCancel on click
                      className="text-red-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {/* Initial Payment Selection */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-gray-700 mb-1">Select Item for Initial Payment (optional):</label>
          <select
            value={selectedItemForPayment}
            onChange={(e) => setSelectedItemForPayment(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">-- No Initial Payment --</option>
            {items.map((item, index) => (
              <option key={index} value={item.productId}>
                {item.productName} (₱{item.lineTotal.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Initial Payment (optional):</label>
          <input
            type="number"
            value={initialPayment}
            onChange={(e) => setInitialPayment(e.target.value === "" ? "" : parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-md p-2"
            step="0.00"
          />

        </div>
      </div>

      {/* Due Date Input */}
      <div>
        <label className="block text-gray-700 mb-1">Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
      >
        Create Invoice
      </button>
    </form>

   {/* Invoice Display */}
{invoiceVisible && (
  <div className="printable fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-1 rounded-lg shadow-lg w-56">
      <div className="text-center mb-1">
        <h2 className="font-bold text-xs">ANU FISH BROKER BAYBAY</h2>
        <p className="text-xs">BAYBAY CITY LEYTE</p>
        <p className="text-xs">Contact: 696969696</p>
      </div>

      <div className="section-divider mb-1">
        <p className="text-xs"><strong>Customer:</strong> {user ? user.fullName : ''}</p>
        <p className="text-xs"><strong>Date:</strong> {currentDate}</p>
        <p className="text-xs"><strong>Due Date:</strong> {dueDate}</p>
      </div>

      <div className="section-divider mb-1">
        <h3 className="font-semibold text-xs">Items:</h3>
        <table className="table-auto w-full text-xs">
          <thead>
            <tr>
              <th className="border-b">Item</th>
              <th className="border-b text-center">Qty</th>
              <th className="border-b text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border-b text-xs">{item.productName}</td>
                <td className="border-b text-center text-xs">x{item.quantity}</td>
                <td className="border-b text-right text-xs">₱{item.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-divider mb-1">
        <p className="text-xs"><strong>Total Amount:</strong> ₱{totalAmount.toFixed(2)}</p>
        <p className="text-xs"><strong>Initial Payment:</strong> ₱{initialPayment.toFixed(2)}</p>
        <p className="text-xs"><strong>Balance Due:</strong> ₱{calculateBalanceDue(totalAmount, initialPayment).toFixed(2)}</p>
      </div>

      <div className="section-divider text-center mb-1">
        <p className="text-xs"><strong>Thank you for your purchase!</strong></p>
      </div>

      <div className="flex justify-between mt-1">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-1 py-1 rounded-md hover:bg-blue-600 text-xs"
        >
          Print Invoice
        </button>
        <button
          onClick={handleCloseInvoice}
          className="bg-red-500 text-white px-1 py-1 rounded-md hover:bg-red-600 text-xs"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CreateInvoice;
