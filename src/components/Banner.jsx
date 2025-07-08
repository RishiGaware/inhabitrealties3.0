import React from 'react';
import { BANNER_IMAGES } from '../config/images';

const Banner = () => {
  return (
    <div className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center animate-subtle-zoom"
        style={{
          backgroundImage: `url(${BANNER_IMAGES.futuristic})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/85 to-black/90"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight bounce-in"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: 'rgb(215, 17, 220)', // Updated vibrant magenta
                fontWeight: '900',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 8px rgba(0,0,0,0.18)', // Soft black shadow only
              }}>
            INHABIT REALTIES
          </h1>
        </div>
        <div className="mb-8">
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed bounce-in font-medium"
             style={{
               animationDelay: '0.2s',
               fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
               color: '#fff',
               fontWeight: '600',
               lineHeight: '1.6',
               textShadow: '0 2px 8px rgba(0,0,0,0.32)'
             }}>
            We connect people with the homes they’ve always imagined
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center bounce-in" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              background: 'linear-gradient(to right, #9333ea, #2563eb)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
              fontWeight: '600'
            }}>
            Sign In
          </button>
          <button 
            onClick={() => window.location.href = '/contact'}
            className="px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              background: 'transparent',
              cursor: 'pointer',
              borderColor: '#FFFFFF',
              borderWidth: '2px',
              fontWeight: '600',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)'
            }}>
            Contact Us
          </button>
        </div>
        <div className="mt-12 text-center bounce-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm font-semibold tracking-wide uppercase"
             style={{
               fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
               color: 'rgb(77, 61, 112)',
               fontWeight: '700',
               letterSpacing: '0.05em',
               textShadow: '0 0 4px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.7), 0 0 12px rgba(255,255,255,0.6)'
            }}>
            Trusted by 10,000+ families
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
