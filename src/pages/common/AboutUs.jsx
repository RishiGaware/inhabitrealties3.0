import React from 'react';
import { FaUserFriends, FaHome, FaHandshake } from 'react-icons/fa';
import aboutImage from '../../assets/images/loginImage1.jpg'; // Reusing a nice image
import useOnScreen from '../../hooks/useOnScreen';

const AboutUs = () => {
  const [headingRef, isVisible] = useOnScreen({ threshold: 0.3 });
  const [contentRef, isContentVisible] = useOnScreen({ threshold: 0.2 });

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="lg:text-center">
          <h2
            className={`text-base text-purple-600 font-bold tracking-wider uppercase transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            About Us
          </h2>
          <p
            className={`mt-4 text-2xl leading-tight font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-3xl transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Trusted Partner in Real Estate
          </p>
          <p
            className={`mt-6 max-w-3xl text-xl text-gray-600 leading-relaxed lg:mx-auto transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We are dedicated to making your real estate journey seamless and successful. Our platform connects buyers, sellers, and agents in a trusted and efficient ecosystem.
          </p>
        </div>

        <div ref={contentRef} className="mt-16 lg:mt-20">
          <div className="grid lg:grid-cols-2 lg:gap-x-12">
            <div
              className={`relative transition-all duration-1000 ${
                isContentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
                <img className="relative rounded-3xl shadow-2xl w-full h-full object-cover" src={aboutImage} alt="About us" />
              </div>
            </div>
            <div
              className={`mt-10 lg:mt-0 flex flex-col justify-center transition-all duration-1000 delay-200 ${
                isContentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <div className="space-y-10">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                      <FaHome />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Comprehensive Listings</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Access a wide range of properties, from cozy apartments to luxurious villas, all in one place.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                      <FaUserFriends />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Expert Agents</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Connect with our network of professional and experienced real estate agents who are ready to assist you.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                      <FaHandshake />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Transparent Process</h3>
                    <p className="mt-2 text-base text-gray-500">
                      We believe in transparency. Enjoy a clear and straightforward process from searching to closing the deal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 