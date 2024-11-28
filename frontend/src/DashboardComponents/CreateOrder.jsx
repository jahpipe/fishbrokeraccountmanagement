import React, { useState } from 'react';

const CreateOrder = () => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [items, setItems] = useState([]);

  const handleAddItem = () => {
    if (product && quantity) {
      setItems([...items, { product, quantity }]);
      setProduct('');
      setQuantity('');
    }
  };

  const handleSaveOrder = () => {
    
    alert('Order saved!');
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create New Order</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Product</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Select Product"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter Quantity"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        onClick={handleAddItem}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
      >
        Add Item
      </button>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Added Products</h3>
        <ul className="list-disc pl-5">
          {items.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item.product} - {item.quantity}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleSaveOrder}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Save Order
        </button>
        <button
          onClick={() => {
           
            alert('Order canceled!');
          }}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateOrder;
