import React from 'react';
import { FaHome, FaSearch, FaHandshake, FaChartLine, FaShieldAlt, FaClock } from 'react-icons/fa';

const FeaturedServices = () => {
  const services = [
    {
      icon: <FaHome className="text-4xl" />,
      title: "Property Management",
      description: "Comprehensive property management services including tenant screening, maintenance, and rent collection.",
      features: ["24/7 Support", "Online Portal", "Maintenance Tracking"]
    },
    {
      icon: <FaSearch className="text-4xl" />,
      title: "Property Search",
      description: "Advanced search tools to help you find the perfect property based on your specific requirements.",
      features: ["Smart Filters", "Saved Searches", "Price Alerts"]
    },
    {
      icon: <FaHandshake className="text-4xl" />,
      title: "Investment Advisory",
      description: "Expert advice on real estate investments with market analysis and portfolio optimization.",
      features: ["Market Analysis", "ROI Projections", "Risk Assessment"]
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Market Insights",
      description: "Real-time market data and trends to help you make informed real estate decisions.",
      features: ["Price Trends", "Market Reports", "Neighborhood Data"]
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Legal Support",
      description: "Professional legal assistance for all your real estate transactions and documentation needs.",
      features: ["Contract Review", "Title Search", "Legal Consultation"]
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: "Quick Transactions",
      description: "Streamlined processes to ensure fast and efficient property transactions.",
      features: ["Digital Signatures", "Online Payments", "Fast Closing"]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Why Choose Inhabit Realties?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            We provide comprehensive real estate services backed by years of experience and a commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-md shadow p-4 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 border border-gray-100"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex flex-col items-center mb-2">
                <span className="text-2xl text-purple-600 mb-1">
                  {service.icon}
                </span>
                <h3 className="text-base font-semibold text-gray-800 mb-1 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {service.title}
                </h3>
              </div>
              <p className="text-xs text-gray-600 mb-2 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                {service.description}
              </p>
              <ul className="text-xs text-gray-700 list-disc list-inside space-y-0.5">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-10 bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-lg font-bold text-purple-600 mb-1" style={{ fontFamily: "'Inter', sans-serif", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
                500+
              </div>
              <div className="text-gray-500 text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                Properties Sold
              </div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-lg font-bold text-purple-600 mb-1" style={{ fontFamily: "'Inter', sans-serif", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
                1000+
              </div>
              <div className="text-gray-500 text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                Happy Clients
              </div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-lg font-bold text-purple-600 mb-1" style={{ fontFamily: "'Inter', sans-serif", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
                15+
              </div>
              <div className="text-gray-500 text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                Years Experience
              </div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-lg font-bold text-purple-600 mb-1" style={{ fontFamily: "'Inter', sans-serif", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
                98%
              </div>
              <div className="text-gray-500 text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                Client Satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices; 