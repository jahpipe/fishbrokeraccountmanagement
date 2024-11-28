import React, { useState } from 'react';

const SupplierAdd = () => {
    const [supplier, setSupplier] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        phoneNumber: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupplier({ ...supplier, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/supplier/suppliers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplier),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Supplier added:', data);
                alert('Supplier added successfully!'); // Alert sa success

                // Reset form
                setSupplier({
                    firstName: '',
                    lastName: '',
                    address: '',
                    city: '',
                    phoneNumber: '',
                });
            } else {
                const errorData = await response.json();
                console.error('Failed to add supplier:', errorData.message);
                alert('Failed to add supplier: ' + errorData.message); // Alert para sa error
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message); // Alert para sa catch error
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Add Supplier</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={supplier.firstName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={supplier.lastName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="address">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={supplier.address}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="city">
                        City
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={supplier.city}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="phoneNumber">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={supplier.phoneNumber}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Add Supplier
                </button>
            </form>
        </div>
    );
};

export default SupplierAdd;
