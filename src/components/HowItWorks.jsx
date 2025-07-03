import React from 'react';
import { FaSearch, FaCalendarCheck, FaKey, FaArrowRight } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaSearch className="text-4xl" />,
      title: "Discover & Explore",
      description: "Use our advanced filters to search for properties that match your exact criteria. Explore high-resolution photos and virtual tours."
    },
    {
      icon: <FaCalendarCheck className="text-4xl" />,
      title: "Schedule a Visit",
      description: "Found something you love? Schedule a private viewing directly from the listing. Our agents will coordinate with you instantly."
    },
    {
      icon: <FaKey className="text-4xl" />,
      title: "Secure Your Home",
      description: "Our streamlined process makes it easy to make an offer, handle paperwork, and secure your new home with confidence."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Journey to a New Home
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            A simple, transparent, and seamless process from start to finish.
          </p>
        </div>

        <div className="relative">
          {/* Dotted line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5">
            <svg width="100%" height="100%">
              <line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="2" strokeDasharray="10, 10" className="stroke-current text-purple-200"></line>
            </svg>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-5 text-center transition-all duration-500 transform hover:shadow-xl hover:-translate-y-2"
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="mb-6 inline-block p-5 bg-purple-100 text-purple-600 rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 