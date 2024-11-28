import React from 'react'
import About from '../Components/About'
import Location from '../Components/Location';

const Main = () => {
    return (
        <div className="p-6 bg-gray-100">
            <section className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Our Premium Fish Products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* Product 1 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img 
                            src="/image/bangus.jpg" 
                            alt="Fresh Bangus (Milkfish)" 
                            className="w-full h-48 object-cover" 
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Fresh Bangus (Milkfish)</h2>
                            <p className="text-gray-600 mb-2">
                            Our Fresh Bangus is sustainably sourced from the crystal-clear waters of the Philippines. Renowned for its tender and flavorful meat, bangus is rich in essential nutrients and perfect for a variety of dishes. Whether you're grilling, frying, or baking, this versatile fish promises a delightful culinary experience.
                            </p>
                            <p className="text-gray-500 text-sm">Price: P250 per Kilo</p>
                        </div>
                    </div>

                    {/* Product 2 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img 
                            src="/image/isdabato.jpg" 
                            alt="isda sa bato" 
                            className="w-full h-48 object-cover" 
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Isda sa Bato (Rockfish)</h2>
                            <p className="text-gray-600 mb-2">
                            Our Isda sa Bato is caught from the rocky coastal waters, offering firm and flaky meat with a mildly sweet flavor. This versatile fish is perfect for grilling, frying, or making hearty soups. Packed with protein and low in fat, Isda sa Bato is an excellent choice for a healthy and satisfying meal.
                            </p>
                            <p className="text-gray-500 text-sm">Price: P250 per Kilo</p>
                        </div>
                    </div>

                    {/* Product 3 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img 
                            src="/image/shrimp.jpg" 
                            alt="Shrimp Cocktail" 
                            className="w-full h-48 object-cover" 
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Shrimp</h2>
                            <p className="text-gray-600 mb-2">
                            Our Fresh Shrimp are sourced from clean, sustainable farms, ensuring top-quality seafood with a sweet and delicate flavor. These succulent shrimp are perfect for any dish—whether you're sautéing, grilling, or adding them to a seafood pasta. Rich in protein and low in calories, they make a delicious and healthy addition to your meals.
                            </p>
                            <p className="text-gray-500 text-sm">Price: P250 per Kilo</p>
                        </div>
                    </div>

                    {/* Product 4 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img 
                            src="/image/squid.jpg" 
                            alt="squid" 
                            className="w-full h-48 object-cover" 
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Fresh Squid</h2>
                            <p className="text-gray-600 mb-2">
                            Our Fresh Squid is sourced from pristine waters, offering tender and mildly sweet meat that's perfect for a variety of dishes. Whether you're grilling, frying, or preparing it as part of a seafood stew, this versatile squid is a favorite for its rich flavor and satisfying texture. Low in fat and high in protein, it's a delicious and nutritious choice.
                            </p>
                            <p className="text-gray-500 text-sm">Price: P250 per Kilo</p>
                        </div>
                    </div>

                    {/* Product 5 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img 
                            src="/image/tilapia.jpg" 
                            alt="tilapia" 
                            className="w-full h-48 object-cover" 
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Fresh Tilapia</h2>
                            <p className="text-gray-600 mb-2">
                            Our Fresh Tilapia is sustainably farmed, delivering mild and flaky fillets that are perfect for any meal. Known for its versatility, tilapia is great for grilling, baking, or frying, and easily absorbs the flavors of your favorite seasonings and marinades. Rich in protein and low in fat, it's a healthy and delicious option for your dining table.
                            </p>
                            <p className="text-gray-500 text-sm">Price: P250 per Kilo</p>
                        </div>
                    </div>

                    {/* Product 6 */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <img 
                            src="/image/yellow.png" 
                            alt="yellow" 
                            className="w-full h-48 object-cover" 
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Fresh Yellowfin Tuna</h2>
                            <p className="text-gray-600 mb-2">
                            Our Fresh Yellowfin Tuna is sourced from the deep, clear waters of the Pacific, offering firm, lean meat with a mild, rich flavor. This premium fish is ideal for sashimi, searing, or grilling, making it a favorite among seafood lovers. Packed with protein and omega-3 fatty acids, Yellowfin Tuna is a nutritious choice for any meal.
                            </p>
                            <p className="text-gray-500 text-sm">Price: P250 per Kilo</p>
                        </div>
                    </div>
                    
                </div>
            </section>
            <div>
            {/* Other sections */}
            
            <section id="about">
                <About />
            </section>
            <section id="Location">
                <Location />
            </section>
        </div>
        </div>
    );
};

export default Main;    