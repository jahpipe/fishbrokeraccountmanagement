

import React, { useState } from 'react';

const StockManagement = () => {
  const [stockEntries, setStockEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ receivedDate: '', quantity: 0 });

  const handleAddEntry = () => {
    
    setStockEntries([...stockEntries, newEntry]);
    setNewEntry({ receivedDate: '', quantity: 0 });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Stock Management</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Add New Stock Entry</h3>
        <input
          type="date"
          value={newEntry.receivedDate}
          onChange={(e) => setNewEntry({ ...newEntry, receivedDate: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg mb-2"
        />
        <input
          type="number"
          value={newEntry.quantity}
          onChange={(e) => setNewEntry({ ...newEntry, quantity: parseFloat(e.target.value) })}
          className="p-2 border border-gray-300 rounded-lg mb-2"
          placeholder="Quantity"
        />
        <button
          onClick={handleAddEntry}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Add Entry
        </button>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Stock Entries</h3>
        <ul>
          {stockEntries.map((entry, index) => (
            <li key={index} className="p-2 border border-gray-300 rounded-lg mb-2">
              <p><strong>Date:</strong> {entry.receivedDate}</p>
              <p><strong>Quantity:</strong> {entry.quantity}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockManagement;
