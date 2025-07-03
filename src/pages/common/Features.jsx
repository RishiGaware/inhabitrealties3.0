import React from 'react';
import { FaAward, FaUsers, FaBuilding } from 'react-icons/fa';
import useOnScreen from '../../hooks/useOnScreen';

const stats = [
  { icon: <FaBuilding className="text-4xl text-purple-600" />, value: '1200+', label: 'Premium Properties' },
  { icon: <FaUsers className="text-4xl text-purple-600" />, value: '4500+', label: 'Happy Customers' },
  { icon: <FaAward className="text-4xl text-purple-600" />, value: '240+', label: 'Awards Winning' },
];

const FeatureCard = ({ stat, index }) => {
  const [cardRef, isCardVisible] = useOnScreen({ threshold: 0.2 });
  return (
    <div
      ref={cardRef}
      key={stat.label}
      className={`relative text-center p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl ${
        isCardVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ 
        transitionDelay: `${index * 200}ms`,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transform: isCardVisible ? 'scale(1)' : 'scale(0.95)',
        opacity: isCardVisible ? 1 : 0
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
           style={{ borderRadius: '1rem' }}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center h-20 w-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-4"
             style={{ borderRadius: '1rem' }}>
          {stat.icon}
        </div>
        <p className="text-4xl font-black leading-none text-gray-900 mb-3" 
           style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {stat.value}
        </p>
        <p className="text-lg font-semibold text-gray-700 leading-relaxed">{stat.label}</p>
      </div>
    </div>
  );
};

const Features = () => {
  const [headingRef, isVisible] = useOnScreen({ threshold: 0.3 });

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 sm:py-24"
         style={{ background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="max-w-3xl mx-auto lg:text-center">
          <h2
            className={`text-base text-purple-600 font-bold tracking-wider uppercase transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ 
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(5px)'
            }}
          >
            Why Choose Us
          </h2>
          <p
            className={`mt-4 text-2xl leading-tight font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-3xl transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ 
              fontFamily: "'Playfair Display', Georgia, serif",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(5px)'
            }}
          >
            Find Real Estate That Suits You
          </p>
          <p
            className={`mt-6 text-xl text-gray-600 leading-relaxed transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ 
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(5px)'
            }}
          >
            Experience a seamless and transparent real estate journey with our dedicated team of experts. 
            We are committed to helping you find the perfect property that meets your needs and exceeds your expectations.
          </p>
        </div>
        <div className="mt-16">
          <dl className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-8">
            {stats.map((stat, index) => (
              <FeatureCard key={stat.label} stat={stat} index={index} />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features; 