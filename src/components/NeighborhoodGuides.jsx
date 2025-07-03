import React from 'react';
import { PROPERTY_IMAGES } from '../config/images';
import { FaHome, FaShieldAlt, FaChartLine, FaHandshake, FaSearch, FaCalculator } from 'react-icons/fa';

const PropertyFeatures = () => {
  const features = [
    {
      name: "Premium Properties",
      image: PROPERTY_IMAGES.luxuryVilla,
      description: "Discover our curated collection of premium properties featuring luxury amenities, modern designs, and prime locations.",
      features: ["Luxury Amenities", "Prime Locations", "Modern Design"],
      icon: FaHome
    },
    {
      name: "Investment Opportunities",
      image: PROPERTY_IMAGES.modernMinimalist,
      description: "Explore high-return investment properties with detailed market analysis and growth potential insights.",
      features: ["Market Analysis", "Growth Potential", "ROI Tracking"],
      icon: FaChartLine
    },
    {
      name: "Expert Guidance",
      image: PROPERTY_IMAGES.victorianHome,
      description: "Get personalized guidance from our experienced real estate professionals throughout your buying or selling journey.",
      features: ["Personalized Service", "Expert Advice", "Full Support"],
      icon: FaHandshake
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Property Features & Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto"
             style={{ fontFamily: "'Inter', sans-serif" }}>
            Discover what makes our real estate services exceptional and find the perfect property that matches your lifestyle and investment goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <img src={feature.image} alt={feature.name} className="w-full h-28 object-cover rounded-md mb-1" />
              <div className="flex items-center mb-1">
                <span className="text-lg text-purple-600 mr-2">{feature.icon}</span>
                <h3 className="text-sm font-semibold text-gray-800 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>{feature.name}</h3>
              </div>
              <p className="text-xs text-gray-600 mb-1 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>{feature.description}</p>
              <ul className="text-xs text-gray-700 list-disc list-inside space-y-0.5">
                {feature.features.map((point, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Services Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Our Comprehensive Services
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto"
               style={{ fontFamily: "'Inter', sans-serif" }}>
              From property search to closing, we provide end-to-end real estate services to make your journey seamless.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-2xl text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}>Property Search</h4>
              <p className="text-sm text-gray-600"
                 style={{ fontFamily: "'Inter', sans-serif" }}>Advanced search with detailed filters</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaCalculator className="text-2xl text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}>Mortgage Calculator</h4>
              <p className="text-sm text-gray-600"
                 style={{ fontFamily: "'Inter', sans-serif" }}>Calculate payments and affordability</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}>Secure Transactions</h4>
              <p className="text-sm text-gray-600"
                 style={{ fontFamily: "'Inter', sans-serif" }}>Safe and protected property transactions</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-2xl text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}>Expert Support</h4>
              <p className="text-sm text-gray-600"
                 style={{ fontFamily: "'Inter', sans-serif" }}>24/7 customer support and guidance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyFeatures; 