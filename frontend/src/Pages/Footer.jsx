import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* About Us */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">About Us</h2>
            <p className="text-gray-400">
              We provide high-quality fish products sourced directly from the ocean to your table. Our mission is to deliver fresh and sustainable seafood to our customers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
              <a href="#top" className="text-gray-400 hover:text-yellow-400">Home</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-yellow-400">About</a>
              </li>
              <li>
                <a href="#location" className="text-gray-400 hover:text-yellow-400">Location</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-400">123 Ocean Drive<br />Baybay City, Leyte 6543<br />Philippines</p>
            <p className="text-gray-400">Email: <a href="mailto:info@fishproducts.com" className="text-yellow-400 hover:underline">info@fishproducts.com</a></p>
            <p className="text-gray-400">Phone: +63 123 4567</p>
          </div>

          {/* Social Media */}
          <div className="w-full md:w-1/4">
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-yellow-400"><FaFacebook size={24} /></a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-yellow-400"><FaTwitter size={24} /></a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-yellow-400"><FaInstagram size={24} /></a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-yellow-400"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Fish Products. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
