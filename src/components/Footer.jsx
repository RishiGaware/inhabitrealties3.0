import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
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
              <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin size={24} /></a>
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