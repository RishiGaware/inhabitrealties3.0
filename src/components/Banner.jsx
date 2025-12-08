import React from 'react';
import { BANNER_IMAGES } from '../config/images';

const Banner = () => {
  return (
    <div className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
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
      <div
  className="relative inline-block p-[6px] rounded-2xl shimmer-border"
>
  <h1
    className="
      text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
      font-black leading-[1.05] tracking-tight
    "
    style={{
      fontFamily: "'Playfair Display', serif",
      background: "linear-gradient(135deg, #a855f7, #c026d3, #db2777)", // Purple to Fuchsia to Pink (Less Red)
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.025em",

      // 🔥 OUTLINE + GLOW RIGHT HERE
      filter: `
        drop-shadow(0 0 3px rgba(255,255,255,0.7))      /* thin bright outline - reduced opacity */
        drop-shadow(0 0 10px rgba(192, 38, 211, 0.3))   /* inner fuchsia glow - reduced opacity */
        drop-shadow(0 0 22px rgba(168, 85, 247, 0.2))   /* outer purple aura - reduced opacity */
        drop-shadow(0 8px 18px rgba(192, 38, 211, 0.25)) /* original soft depth - reduced opacity */
        drop-shadow(0 2px 6px rgba(0,0,0,0.25))         /* original shadow - reduced opacity */
      `,
    }}
  >
    INHABIT REALTIES
  </h1>
</div>
        </div>
        <div className="mb-8">
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed bounce-in font-medium"
             style={{
               animationDelay: '0.2s',
               fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
               color: '#f3f4f6', // Gray-100
               fontWeight: '500',
               lineHeight: '1.6',
               textShadow: '0 2px 4px rgba(0,0,0,0.5)'
             }}>
            We connect people with the homes they’ve always imagined
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center bounce-in" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              background: 'linear-gradient(to right, #a855f7, #c026d3)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(192, 38, 211, 0.3)',
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
