import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductView = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products`);
                setProducts(response.data);
            } catch (error) {
                setError('Failed to fetch products: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleUpdate = (product) => {
        setSelectedProduct(product); // Set selected product
    };

    const handleCloseModal = () => {
        setSelectedProduct(null); // Close the modal
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Send a PUT request to update the product
            await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products/${selectedProduct.product_id}`, selectedProduct);
            // Refresh product list
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products`);
            setProducts(response.data);
            handleCloseModal(); // Close modal after update
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 relative">
            <div className="container mx-auto bg-white shadow-md rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Product List</h2>
                {products.length === 0 && !error && (
                    <p className="text-gray-700 text-center">No products available.</p>
                )}
                {products.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white border-collapse rounded-lg shadow-md">
                                <thead className="bg-gray-200 text-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm">Name</th>
                                        <th className="px-4 py-3 text-left text-sm">Category</th>
                                        <th className="px-4 py-3 text-left text-sm">Weight (kg)</th>
                                        <th className="px-4 py-3 text-left text-sm">Description</th>
                                        <th className="px-4 py-3 text-left text-sm">Price</th>
                                        <th className="px-4 py-3 text-left text-sm">Arrival Date</th>
                                        <th className="px-4 py-3 text-left text-sm">Arrival Time</th>
                                        <th className="px-4 py-3 text-left text-sm">Photo</th>
                                        <th className="px-4 py-3 text-left text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm">
                                    {currentProducts.map((product) => (
                                        <tr key={product.product_id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                                            <td className="px-4 py-3">{product.product_name}</td>
                                            <td className="px-4 py-3">{product.category}</td>
                                            <td className="px-4 py-3">{product.kilo}</td>
                                            <td className="px-4 py-3">{product.description}</td>
                                            <td className="px-4 py-3">₱{Number(product.current_price).toFixed(2)}</td>
                                            <td className="px-4 py-3">
                                                {new Date(product.arrival_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">{product.arrival_time}</td>
                                            <td className="px-4 py-3">
                                                {product.photo ? (
                                                     <img
                                                     src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/uploads/${product.photo}`} // Adjust URL as needed
                                                     alt={product.product_name}
                                                     className="w-20 h-20 object-cover rounded-lg"
                                                 />
                                                ) : (
                                                    <p className="text-gray-500">No image</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleUpdate(product)}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg text-white ${
                                    currentPage === 1 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                Previous
                            </button>
                            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg text-white ${
                                    currentPage === totalPages ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Floating Update Button */}
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => setSelectedProduct({})} // Open modal for new product
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h1m0 0V8h-1m1 8h1v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1h1m8-1a1 1 0 001-1v-1a1 1 0 00-1-1h-1a1 1 0 00-1 1v1a1 1 0 001 1h1zm0 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1m8-5h1a1 1 0 011 1v1a1 1 0 01-1 1h-1m-8 0H7a1 1 0 00-1 1v1m0-1h1a1 1 0 011-1h1m0 0h1a1 1 0 011 1m-8 1h1a1 1 0 011-1m0 0V8m-4 8h1m8 0H7" />
                    </svg>
                </button>
            </div>

            {/* Modal for Updating Product */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Update Product</h2>
                        {/* Form for updating product */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Name:</label>
                                <input
                                    type="text"
                                    value={selectedProduct.product_name || ''}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, product_name: e.target.value })}
                                    className="border border-gray-300 rounded-lg w-full p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Category:</label>
                                <input
                                    type="text"
                                    value={selectedProduct.category || ''}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                                    className="border border-gray-300 rounded-lg w-full p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Weight (kg):</label>
                                <input
                                    type="number"
                                    value={selectedProduct.kilo || ''}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, kilo: e.target.value })}
                                    className="border border-gray-300 rounded-lg w-full p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Description:</label>
                                <textarea
                                    value={selectedProduct.description || ''}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                    className="border border-gray-300 rounded-lg w-full p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Price:</label>
                                <input
                                    type="number"
                                    value={selectedProduct.current_price || ''}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, current_price: e.target.value })}
                                    className="border border-gray-300 rounded-lg w-full p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Arrival Date:</label>
                                <input
                                    type="date"
                                    value={selectedProduct.arrival_date || ''}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, arrival_date: e.target.value })}
                                    className="border border-gray-300 rounded-lg w-full p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Arrival Time:</label>
                                <input
                                    type="time"
                                    value={selectedProduct.arrival_time || ''}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, arrival_time: e.target.value })}
                                    className="border border-gray-300 rounded-lg w-full p-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save</button>
                                <button type="button" onClick={handleCloseModal} className="ml-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductView;
