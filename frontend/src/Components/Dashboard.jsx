import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaBox,  FaUsers, FaWarehouse,
  FaChartBar, FaBars, FaSignOutAlt, FaPlus,
  FaChevronDown, FaChevronUp, FaTimes,
  FaUserCircle, FaFileInvoice
} from 'react-icons/fa';
import ProductsAdd from '../DashboardComponents/ProductsAdd';
import ProductsView from '../DashboardComponents/ProductsView';
import Categories from '../DashboardComponents/Categories';
import UserAdd from '../DashboardComponents/UserAdd';
import UserView from '../DashboardComponents/UserView';
import Reports from '../DashboardComponents/Reports';
import CreateOrder from '../DashboardComponents/CreateOrder';
import DeliveriesManagement from '../InventoryComponents/DeliveriesManagement';
import SalesTracking from '../InventoryComponents/SalesTracking';
import UpdateStock from '../InventoryComponents/UpdateStock';
import Invoice from '../InvoicesComponents/Invoice';
import CreateInvoice from '../InvoicesComponents/CreateInvoice';
import ManageInvoices from '../InvoicesComponents/ManageInvoices';
import ViewLedgers from '../LedgerComponents/ViewLedgers';
import SupplierView from '../DashboardComponents/SupplierView';
import SupplierAdd from '../DashboardComponents/SupplierAdd';
import Reportspass from '../PassingComponentIntodashboard/Reportspass';

const COMPONENTS = {
  DASHBOARD: 'dashboard',
  PRODUCTS_ADD: 'productsAdd',
  PRODUCTS_VIEW: 'productsView',
  CATEGORIES: 'categories',
  ADD_USER: 'addUser',
  VIEW_USERS: 'viewUsers',
  REPORTS: 'reports',
  CREATE_ORDER: 'createOrder',
  DELIVERIES_MANAGEMENT: 'deliveriesManagement',
  SALES_TRACKING: 'salesTracking',
  STOCK_LEVELS: 'stockLevels',
  UPDATE_STOCK: 'updateStock',
  INVOICE: 'invoice',
  CREATE_INVOICE: 'createInvoice',
  MANAGE_INVOICE: 'manageInvoice',
  ViewLedgers: 'viewLedger',
   SUPPLIER_ADD: 'supplierAdd',      
  SUPPLIER_VIEW: 'supplierView'
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState(COMPONENTS.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const navigate = useNavigate();
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);

 
  const handleLogout = () => {
    navigate('/login');
  };


  const toggleSupplierDropdown = () => {
    setIsSupplierOpen(!isSupplierOpen);
  };

  const toggleLedgerDropdown = () => {
    setIsLedgerOpen(!isLedgerOpen);
  };


  const handleSidebarClick = (component) => {
    setActiveComponent(component);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  
  const toggleProductsDropdown = () => {
    setIsProductsOpen(!isProductsOpen);
    setIsUsersOpen(false);
    setIsInventoryOpen(false);
    setIsInvoiceOpen(false);
  };

  const toggleUsersDropdown = () => {
    setIsUsersOpen(!isUsersOpen);
    setIsProductsOpen(false);
    setIsInventoryOpen(false);
    setIsInvoiceOpen(false);
  };

  const toggleInventoryDropdown = () => {
    setIsInventoryOpen(!isInventoryOpen);
    setIsProductsOpen(false);
    setIsUsersOpen(false);
    setIsInvoiceOpen(false);
  };

  const toggleInvoiceDropdown = () => {
    setIsInvoiceOpen(!isInvoiceOpen);
    setIsProductsOpen(false);
    setIsUsersOpen(false);
    setIsInventoryOpen(false);
  };

  const renderContent = () => {
    const components = {
      [COMPONENTS.PRODUCTS_ADD]: <ProductsAdd />,
      [COMPONENTS.PRODUCTS_VIEW]: <ProductsView />,
      [COMPONENTS.CATEGORIES]: <Categories />,
      [COMPONENTS.ADD_USER]: <UserAdd />,
      [COMPONENTS.VIEW_USERS]: <UserView />,
      [COMPONENTS.REPORTS]: <Reports />,
      [COMPONENTS.CREATE_ORDER]: <CreateOrder />,
      [COMPONENTS.DASHBOARD]: (
        <>
          <Reportspass />
        </>
      ),
      [COMPONENTS.DELIVERIES_MANAGEMENT]: <DeliveriesManagement />,
      [COMPONENTS.INVOICE]: <Invoice />,
      [COMPONENTS.ViewLedgers]: <ViewLedgers />,
      [COMPONENTS.CREATE_INVOICE]: <CreateInvoice/>,
      [COMPONENTS.MANAGE_INVOICE]: <ManageInvoices />,
      [COMPONENTS.SALES_TRACKING]: <SalesTracking />,
      [COMPONENTS.UPDATE_STOCK]: <UpdateStock />,
      [COMPONENTS.SUPPLIER_ADD]: <SupplierAdd />,
      [COMPONENTS.SUPPLIER_VIEW]: <SupplierView />
    };
    return components[activeComponent] || <div>Content not found</div>;
  };

  return (
    <div className={`flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 h-full w-64 bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:w-64 md:flex md:flex-col`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-2xl font-semibold">ANU FISH BROKER</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        <ul className="flex flex-col flex-grow overflow-y-auto">
          <li className="mb-4">
            <a
              href="#"
              className="flex items-center p-2 rounded-lg hover:bg-blue-600 transition-colors group"
              onClick={() => handleSidebarClick(COMPONENTS.DASHBOARD)}
            >
              <FaTachometerAlt className="mr-3 text-xl group-hover:text-yellow-300 transition-colors" />
              Dashboard
            </a>
          </li>
  
          {/* Invoice Dropdown */}
          <li className="mb-4">
            <button
              className="flex items-center p-2 rounded-lg hover:bg-blue-600 transition-colors group w-full text-left"
              onClick={toggleInvoiceDropdown}
            >
              <FaFileInvoice className="mr-3 text-xl group-hover:text-yellow-300 transition-colors" />
              Invoice
              {isInvoiceOpen ? <FaChevronUp className="ml-auto text-yellow-300" /> : <FaChevronDown className="ml-auto text-gray-200" />}
            </button>
            {isInvoiceOpen && (
              <ul className="pl-8 mt-2 max-h-40 overflow-y-auto bg-blue-500 rounded-lg">
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.CREATE_INVOICE)}
                  >
                    Create Invoice
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.MANAGE_INVOICE)}
                  >
                    Manage Invoice
                  </button>
                </li>
              </ul>
            )}
          </li>
  
          {/* Ledger Dropdown */}
          <li className="mb-4">
            <button
              className="flex items-center p-2 rounded-lg hover:bg-blue-600 transition-colors group w-full text-left"
              onClick={toggleLedgerDropdown}
            >
              <FaFileInvoice className="mr-3 text-xl group-hover:text-yellow-300 transition-colors" />
              Ledger
              {isLedgerOpen ? <FaChevronUp className="ml-auto text-yellow-300" /> : <FaChevronDown className="ml-auto text-gray-200" />}
            </button>
            {isLedgerOpen && (
              <ul className="pl-8 mt-2 max-h-40 overflow-y-auto bg-blue-500 rounded-lg">
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.ViewLedgers)}
                  >
                    View Ledgers
                  </button>
                </li>
              </ul>
            )}
          </li>
  
          {/* Products Dropdown */}
          <li className="mb-4">
            <button
              className="flex items-center p-2 rounded-lg hover:bg-blue-600 transition-colors group w-full text-left"
              onClick={toggleProductsDropdown}
            >
              <FaBox className="mr-3 text-xl group-hover:text-yellow-300 transition-colors" />
              Products
              {isProductsOpen ? <FaChevronUp className="ml-auto text-yellow-300" /> : <FaChevronDown className="ml-auto text-gray-200" />}
            </button>
            {isProductsOpen && (
              <ul className="pl-8 mt-2 max-h-40 overflow-y-auto bg-blue-500 rounded-lg">
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.PRODUCTS_ADD)}
                  >
                    <FaPlus className="mr-3 text-xl" />
                    Add Product
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.PRODUCTS_VIEW)}
                  >
                    View Products
                  </button>
                </li>
              </ul>
            )}
          </li>
  
          {/* Users Dropdown */}
          <li className="mb-4">
            <button
              className="flex items-center p-2 rounded-lg hover:bg-blue-600 transition-colors group w-full text-left"
              onClick={toggleUsersDropdown}
            >
              <FaUsers className="mr-3 text-xl group-hover:text-yellow-300 transition-colors" />
              Users
              {isUsersOpen ? <FaChevronUp className="ml-auto text-yellow-300" /> : <FaChevronDown className="ml-auto text-gray-200" />}
            </button>
            {isUsersOpen && (
              <ul className="pl-8 mt-2 max-h-40 overflow-y-auto bg-blue-500 rounded-lg">
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.ADD_USER)}
                  >
                    Add User
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.VIEW_USERS)}
                  >
                    View Users
                  </button>
                </li>
              </ul>
            )}
          </li>
  
          {/* Supplier Dropdown */}
          <li className="mb-4">
            <button
              className="flex items-center p-2 rounded-lg hover:bg-blue-600 transition-colors group w-full text-left"
              onClick={toggleSupplierDropdown}
            >
              <FaUserCircle className="mr-3 text-xl group-hover:text-yellow-300 transition-colors" />
              Suppliers
              {isSupplierOpen ? <FaChevronUp className="ml-auto text-yellow-300" /> : <FaChevronDown className="ml-auto text-gray-200" />}
            </button>
            {isSupplierOpen && (
              <ul className="pl-8 mt-2 max-h-40 overflow-y-auto bg-blue-500 rounded-lg">
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.SUPPLIER_ADD)}
                  >
                    <FaPlus className="mr-3 text-xl" />
                    Add Supplier
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.SUPPLIER_VIEW)}
                  >
                    View Suppliers
                  </button>
                </li>
              </ul>
            )}
          </li>
  
          {/* Inventory Dropdown */}
          <li className="mb-4">
            <button
              className="flex items-center p-2 rounded-lg hover:bg-blue-600 transition-colors group w-full text-left"
              onClick={toggleInventoryDropdown}
            >
              <FaWarehouse className="mr-3 text-xl group-hover:text-yellow-300 transition-colors" />
              Inventory
              {isInventoryOpen ? <FaChevronUp className="ml-auto text-yellow-300" /> : <FaChevronDown className="ml-auto text-gray-200" />}
            </button>
            {isInventoryOpen && (
              <ul className="pl-8 mt-2 max-h-40 overflow-y-auto bg-blue-500 rounded-lg">
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.DELIVERIES_MANAGEMENT)}
                  >
                    Deliveries Management
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.SALES_TRACKING)}
                  >
                    Sales Tracking
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-blue-400 transition-colors group w-full text-left"
                    onClick={() => handleSidebarClick(COMPONENTS.UPDATE_STOCK)}
                  >
                    Update Stock
                  </button>
                </li>
              </ul>
            )}
          </li>
  
          {/* Reports */}
          <li className="mb-4">
            <a
              href="#"
              className="flex items-center p-2 rounded-lg hover:bg-blue-600 transition-colors group"
              onClick={() => handleSidebarClick(COMPONENTS.REPORTS)}
            >
              <FaChartBar className="mr-3 text-xl group-hover:text-yellow-300 transition-colors" />
              Reports
            </a>
          </li>
  
          {/* Logout */}
          <li className="mb-4">
            <button
              className="flex items-center p-2 rounded-lg hover:bg-blue-600 transition-colors group w-full text-left"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-3 text-xl group-hover:text-yellow-300 transition-colors" />
              Logout
            </button>
          </li>
        </ul>
      </div>
  
      {/* Main Content */}
      <div
  className={`flex-1 p-6 bg-gradient-to-r from-teal-200 via-indigo-200 to-pink-200 overflow-y-auto transition-transform duration-300 ease-in-out 
    ${isSidebarOpen ? 'ml-64' : 'ml-0'} 
    md:ml-64`}
>
  <div className="md:hidden mb-4">
    <button
      className="p-2 rounded-lg bg-blue-600 text-white"
      onClick={() => setIsSidebarOpen(true)}
    >
      <FaBars className="text-xl" />
    </button>
  </div>
  {renderContent()}
</div>
    </div>
  );
  
};

export default Dashboard;
