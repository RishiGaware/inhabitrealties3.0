import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const Footer = () => {
  const navigate = useNavigate();

  // Helper for anchor scroll
  const handleAnchor = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el2 = document.getElementById(id);
        if (el2) el2.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  }, [navigate]);

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Inhabit Realties</h3>
            <p className="text-gray-400">
              Your partner in finding the perfect property. We are dedicated to making your real estate journey seamless and successful.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => { navigate('/'); window.scrollTo(0, 0); }} className="text-gray-400 hover:text-white bg-transparent border-none p-0 m-0 cursor-pointer">Home</button></li>
              <li><button onClick={() => { navigate('/about', { state: { fromFooter: true } }); window.scrollTo(0, 0); }} className="text-gray-400 hover:text-white bg-transparent border-none p-0 m-0 cursor-pointer">About Us</button></li>
              <li><button onClick={() => { navigate('/contact', { state: { fromFooter: true } }); window.scrollTo(0, 0); }} className="text-gray-400 hover:text-white bg-transparent border-none p-0 m-0 cursor-pointer">Contact</button></li>
              <li><button onClick={() => handleAnchor('features-section')} className="text-gray-400 hover:text-white bg-transparent border-none p-0 m-0 cursor-pointer">Features</button></li>
            </ul>
          </div>
          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/inhabitpro.realties" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/in/inhabit-pro-realties/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <FaLinkedin size={24} />
              </a>
              <a 
                href="https://www.youtube.com/@InhabitProRealties" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  className="transition-all duration-300"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/inhabitprorealties/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Inhabit Realties. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;