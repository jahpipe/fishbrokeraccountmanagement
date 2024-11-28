import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsAdd = () => {
  const [newProductName, setNewProductName] = useState('');
  const [category, setCategory] = useState('');
  const [kilo, setKilo] = useState('');
  const [description, setDescription] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/categories`)
      .then(response => setCategories(response.data))
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories.');
      });

    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/supplier/suppliers`)
      .then(response => setSuppliers(response.data))
      .catch(error => {
        console.error('Error fetching suppliers:', error);
        setError('Failed to load suppliers.');
      });
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newProductName || !category || !kilo || !currentPrice || !selectedSupplier) {
      setError('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('product_name', newProductName);
    formData.append('category', category);
    formData.append('kilo', kilo);
    formData.append('description', description);
    formData.append('current_price', currentPrice);
    formData.append('arrival_date', arrivalDate);
    formData.append('arrival_time', arrivalTime);
    formData.append('supplier_id', selectedSupplier);
    if (image) formData.append('image', image);

    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products`, formData)
      .then(response => {
        console.log(response.data);
        // Clear form fields on success
        setNewProductName('');
        setCategory('');
        setKilo('');
        setDescription('');
        setCurrentPrice('');
        setArrivalDate('');
        setArrivalTime('');
        setImage(null);
        setSelectedSupplier('');
        setSuccess('Product added successfully!');
        setError('');
        alert('Product added successfully!');
      })
      .catch(error => {
        console.error('Error adding product:', error.response ? error.response.data : error);
        setError(error.response ? error.response.data.message : 'Failed to add product.');
      });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Product</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">New Product Name:</label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Add new product name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Kilo:</label>
            <input
              type="number"
              value={kilo}
              onChange={(e) => setKilo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Current Price:</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Arrival Date:</label>
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Arrival Time:</label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Supplier:</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select a supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                  {`${supplier.SupplierFirstName} ${supplier.SupplierLastName}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Product Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductsAdd;
