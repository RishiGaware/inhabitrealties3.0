import React from 'react';
import logo from '../assets/images/logo.png';

const screenshots = [
  'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&w=200&h=400',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&w=200&h=400',
  'https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg?auto=compress&w=200&h=400',
];
const suggestedApps = [
  { name: 'Dream Homes', icon: 'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&w=60&h=60' },
  { name: 'RentEasy', icon: 'https://images.pexels.com/photos/221502/pexels-photo-221502.jpeg?auto=compress&w=60&h=60' },
  { name: 'PropFinder', icon: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&w=60&h=60' },
];

const DownloadAppSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
        {/* Left Side */}
        <div className="flex-1 w-full max-w-lg mb-10 md:mb-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center md:text-left" style={{ fontFamily: "'Playfair Display', serif" }}>
            Real Estate in your pocket
          </h2>
          <p className="text-gray-700 mb-6 text-center md:text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
            With our app, spend less time searching and more time at your dream home. <span className="font-semibold text-gray-900">Download now!</span>
          </p>
          {/* <form className="flex flex-col sm:flex-row items-center gap-2 mb-6 justify-center md:justify-start">
            <input
              type="tel"
              placeholder="Enter Mobile number"
              className="px-3 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-200 outline-none text-sm flex-1 w-full sm:w-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-md font-semibold text-sm hover:bg-green-600 transition-all w-full sm:w-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Send Link
            </button>
          </form> */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 justify-center md:justify-start">
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-12" />
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-12" />
            </a>
            <div className="flex flex-col items-center sm:ml-4 mt-2 sm:mt-0">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://inhabitrealties.vercel.app" alt="QR Code" className="h-20 w-20 rounded-md border border-gray-300 shadow" />
              <span className="text-xs text-gray-500 mt-1">Scan to Download</span>
            </div>
          </div>
        </div>
        {/* Right Side - Store Listing Mockups */}
        <div className="flex-1 flex flex-col sm:flex-row justify-center items-center w-full max-w-2xl gap-6">
          {/* Play Store Listing */}
          <div className="bg-white bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-2xl border border-gray-200 p-0 flex flex-col items-stretch w-72 min-w-[220px] max-w-[320px] overflow-hidden mb-6 sm:mb-0">
            {/* Play Store Top Bar */}
            <div className="bg-green-600 flex items-center px-3 py-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-5 mr-2" />
              <input className="flex-1 bg-green-100 rounded px-2 py-1 text-xs text-gray-700" value="Inhabit Realties" readOnly />
            </div>
            {/* App Card */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <img src={logo} alt="Inhabit Realties Logo" className="w-14 h-14 rounded-xl border border-gray-200 shadow" />
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-base leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Inhabit Realties</div>
                <div className="text-xs text-gray-500">Inhabit Team</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-xs text-gray-700 font-semibold">4.8</span>
                  <span className="text-xs text-gray-400">(2K reviews)</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Contains ads · In-app purchases</div>
              </div>
              <button className="bg-green-600 text-white px-3 py-1 rounded font-semibold text-xs hover:bg-green-700 transition">Install</button>
            </div>
            {/* Screenshots */}
            <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50">
              {screenshots.map((src, i) => (
                <img key={i} src={src} alt={`Screenshot ${i+1}`} className="h-24 w-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
              ))}
            </div>
            {/* Suggested Apps */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gradient-to-r from-green-50 to-green-100">
              <div className="text-xs text-gray-500 mb-1">Suggested for you</div>
              <div className="flex gap-2">
                {suggestedApps.map((app, i) => (
                  <div key={i} className="flex flex-col items-center w-12">
                    <img src={app.icon} alt={app.name} className="w-8 h-8 rounded-lg border border-gray-200 mb-1 shadow-sm" />
                    <span className="text-[10px] text-gray-600 text-center truncate w-full">{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* App Store Listing */}
          <div className="bg-white bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-gray-200 p-0 flex flex-col items-stretch w-72 min-w-[220px] max-w-[320px] overflow-hidden">
            {/* App Store Top Bar */}
            <div className="bg-blue-600 flex items-center px-3 py-2">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-5 mr-2" />
              <input className="flex-1 bg-blue-100 rounded px-2 py-1 text-xs text-gray-700" value="Inhabit Realties" readOnly />
            </div>
            {/* App Card */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <img src={logo} alt="Inhabit Realties Logo" className="w-14 h-14 rounded-xl border border-gray-200 shadow" />
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-base leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Inhabit Realties</div>
                <div className="text-xs text-gray-500">Inhabit Team</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-xs text-gray-700 font-semibold">4.9</span>
                  <span className="text-xs text-gray-400">(1.5K ratings)</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Offers In-App Purchases</div>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded font-semibold text-xs hover:bg-blue-700 transition">GET</button>
            </div>
            {/* Screenshots */}
            <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
              {screenshots.map((src, i) => (
                <img key={i} src={src} alt={`Screenshot ${i+1}`} className="h-24 w-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
              ))}
            </div>
            {/* You Might Also Like */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="text-xs text-gray-500 mb-1">You Might Also Like</div>
              <div className="flex gap-2">
                {suggestedApps.map((app, i) => (
                  <div key={i} className="flex flex-col items-center w-12">
                    <img src={app.icon} alt={app.name} className="w-8 h-8 rounded-lg border border-gray-200 mb-1 shadow-sm" />
                    <span className="text-[10px] text-gray-600 text-center truncate w-full">{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection; 