import React from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

const Categories = () => {
  return (
    <div className="p-4 bg-gray-800 text-white shadow-md rounded-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Categories</h2>
        <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
          <FaPlus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="py-2 px-4 border-b text-center">ID</th>
              <th className="py-2 px-4 border-b text-center">Name</th>
              <th className="py-2 px-4 border-b text-center">Status</th>
              <th className="py-2 px-4 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-gray-900">
              <td className="py-2 px-4 border-b text-center">1</td>
              <td className="py-2 px-4 border-b text-center">Category 1</td>
              <td className="py-2 px-4 border-b text-center">Active</td>
              <td className="py-2 px-4 border-b text-center">
                <div className="flex space-x-2 justify-center">
                  <button className="text-blue-400 hover:text-blue-600">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-400 hover:text-red-600">
                    <FaTrashAlt className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr className="even:bg-gray-900">
              <td className="py-2 px-4 border-b text-center">2</td>
              <td className="py-2 px-4 border-b text-center">Category 2</td>
              <td className="py-2 px-4 border-b text-center">Inactive</td>
              <td className="py-2 px-4 border-b text-center">
                <div className="flex space-x-2 justify-center">
                  <button className="text-blue-400 hover:text-blue-600">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-400 hover:text-red-600">
                    <FaTrashAlt className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
           
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
