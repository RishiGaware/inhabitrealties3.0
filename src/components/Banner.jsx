import React from 'react';
import { BANNER_IMAGES } from '../config/images';

const Banner = () => {
  return (
    <div className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center animate-subtle-zoom"
        style={{
          backgroundImage: `url(${BANNER_IMAGES.main})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight bounce-in"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                textShadow: '0 4px 12px rgba(0,0,0,0.6)',
                color: '#FFFFFF'
              }}>
            Find Your Dream Home
          </h1>
        </div>
        <div className="mb-8">
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-100 leading-relaxed bounce-in font-light"
             style={{
               animationDelay: '0.2s',
               fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
               textShadow: '0 2px 6px rgba(0,0,0,0.7)'
             }}>
            Discover exceptional properties with our curated collection of premium real estate listings.
            Your perfect home awaits.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center bounce-in" style={{ animationDelay: '0.4s' }}>
          <button className="px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  style={{
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    background: 'linear-gradient(to right, #9333ea, #2563eb)',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
            Browse Properties
          </button>
          <button className="px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                  style={{
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    background: 'transparent',
                    cursor: 'pointer'
                  }}>
            Schedule Viewing
          </button>
        </div>
        <div className="mt-12 text-center bounce-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-gray-200 font-medium tracking-wide uppercase"
             style={{
               fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
               textShadow: '0 1px 4px rgba(0,0,0,0.8)'
            }}>
            Trusted by 10,000+ families
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
