import React, { useState, useEffect } from 'react';

const SupplierView = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phoneNumber: '',
  });

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/supplier/suppliers`);
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/supplier/suppliers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Supplier deleted successfully!');
          fetchSuppliers(); // Refresh supplier list
        } else {
          alert('Failed to delete supplier.');
        }
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier.SupplierID);
    setFormData({
      firstName: supplier.SupplierFirstName,
      lastName: supplier.SupplierLastName,
      address: supplier.Address,
      city: supplier.City,
      phoneNumber: supplier.PhoneNumber,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/supplier/suppliers/${editingSupplier}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Supplier updated successfully!');
        setEditingSupplier(null);
        setFormData({
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          phoneNumber: '',
        });
        fetchSuppliers(); // Refresh supplier list
      } else {
        alert('Failed to update supplier.');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Supplier List</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Table for displaying suppliers */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border p-3 text-left">First Name</th>
                  <th className="border p-3 text-left">Last Name</th>
                  <th className="border p-3 text-left">Address</th>
                  <th className="border p-3 text-left">City</th>
                  <th className="border p-3 text-left">Phone Number</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr
                    key={supplier.SupplierID}
                    className="hover:bg-gray-100 transition duration-200 ease-in-out"
                  >
                    <td className="border p-3">{supplier.SupplierFirstName}</td>
                    <td className="border p-3">{supplier.SupplierLastName}</td>
                    <td className="border p-3">{supplier.Address}</td>
                    <td className="border p-3">{supplier.City}</td>
                    <td className="border p-3">{supplier.PhoneNumber}</td>
                    <td className="border p-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded transition-colors duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.SupplierID)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors duration-150"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit form for suppliers */}
          {editingSupplier && (
            <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Edit Supplier</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500 transition duration-150"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500 transition duration-150"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500 transition duration-150"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500 transition duration-150"
                  />
                </div>
                <div className="mb-4 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500 transition duration-150"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-150"
                >
                  Update Supplier
                </button>
                <button
                  onClick={() => setEditingSupplier(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors duration-150"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupplierView;
