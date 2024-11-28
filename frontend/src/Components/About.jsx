import React from 'react'

const About = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-12 px-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
            <p className="text-lg text-gray-700 max-w-2xl mb-8">
                Welcome to our website! We are dedicated to providing the best fish products for all your needs. 
                Our team is passionate about seafood and committed to delivering high-quality, fresh products to our customers. 
                With years of experience in the industry, we strive to offer a wide selection of fish and seafood that meets the highest standards of quality and sustainability.
            </p>
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-600">
                    Our mission is to connect people with the finest seafood available, ensuring every meal is a memorable experience. 
                    We believe in ethical sourcing and aim to support sustainable practices in the seafood industry. 
                    Our commitment to quality and customer satisfaction drives everything we do.
                </p>
            </div>
        </div>
    );
};

export default About;