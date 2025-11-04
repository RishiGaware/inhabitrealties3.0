import React from 'react';
import { FaUserFriends, FaHome, FaHandshake, FaArrowLeft, FaDownload, FaFilePdf, FaStar, FaCheckCircle, FaEye, FaShare, FaBuilding, FaMapMarkerAlt, FaChartLine } from 'react-icons/fa';
import aboutImage from '../../assets/images/loginImage1.jpg'; // Reusing a nice image
import useOnScreen from '../../hooks/useOnScreen';
import { useNavigate, useLocation } from 'react-router-dom';

const AboutUsWithBrochure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [headingRef, isVisible] = useOnScreen({ threshold: 0.3 });
  const [contentRef, isContentVisible] = useOnScreen({ threshold: 0.2 });
  const [brochureRef, isBrochureVisible] = useOnScreen({ threshold: 0.2 });

 
  const handleBrochureDownload = () => {
    // Create different brochure content based on random selection
    const brochureTypes = [
      {
        title: "Inhabit Realties - Premium Properties Guide",
        content: `
          Inhabit Realties - Premium Properties Guide
          
          About Us:
          We are dedicated to making your real estate journey seamless and successful. 
          Our platform connects buyers, sellers, and agents in a trusted and efficient ecosystem.
          
          Premium Services:
          • Luxury Property Listings
          • VIP Client Services
          • Exclusive Market Access
          • Personalized Property Tours
          • Investment Portfolio Management
          
          Contact Information:
          Email: premium@inhabitrealties.com
          Phone: +1 (555) 123-4567
          Website: www.inhabitrealties.com/premium
          
          Download Date: ${new Date().toLocaleDateString()}
        `,
        filename: 'InhabitRealties_Premium_Guide.txt'
      },
      {
        title: "Inhabit Realties - Investment Properties",
        content: `
          Inhabit Realties - Investment Properties Guide
          
          Investment Opportunities:
          We specialize in high-yield investment properties across prime locations.
          
          Investment Services:
          • Commercial Property Investments
          • Residential Rental Properties
          • REIT Investment Opportunities
          • Property Management Services
          • Market Analysis & ROI Projections
          
          Contact Information:
          Email: investments@inhabitrealties.com
          Phone: +1 (555) 123-4567
          Website: www.inhabitrealties.com/investments
          
          Download Date: ${new Date().toLocaleDateString()}
        `,
        filename: 'InhabitRealties_Investment_Guide.txt'
      },
      {
        title: "Inhabit Realties - First-Time Buyers Guide",
        content: `
          Inhabit Realties - First-Time Buyers Guide
          
          Welcome to Homeownership:
          Your complete guide to buying your first home with confidence.
          
          First-Time Buyer Services:
          • Mortgage Pre-Approval Assistance
          • Down Payment Programs
          • First-Time Buyer Incentives
          • Property Inspection Services
          • Closing Cost Assistance
          
          Contact Information:
          Email: firsttime@inhabitrealties.com
          Phone: +1 (555) 123-4567
          Website: www.inhabitrealties.com/firsttime
          
          Download Date: ${new Date().toLocaleDateString()}
        `,
        filename: 'InhabitRealties_FirstTimeBuyer_Guide.txt'
      }
    ];

    // Randomly select a brochure type
    const randomBrochure = brochureTypes[Math.floor(Math.random() * brochureTypes.length)];

    // Create a blob and download
    const blob = new Blob([randomBrochure.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = randomBrochure.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      
      
      {/* Back to Home Button - Only show if not coming from footer Quick Links */}
      <div className="max-w-7xl mx-auto mb-8">
        {location.pathname !== '/' && !location.state?.fromFooter && (
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:text-purple-700 transition-all duration-300 transform hover:scale-105"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </button>
        )}
      </div>
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

        {/* Simplified Brochure Download Section */}
        <div ref={brochureRef} className="mt-8 lg:mt-12">
          <div className={`transition-all duration-700 ${isBrochureVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Left Side */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <FaFilePdf className="text-purple-600 text-2xl" />
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Download Our Brochure
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Learn more about Inhabit Realties — our services, team, and commitment to simplifying real estate for everyone.
                  </p>
                  <ul className="space-y-2 text-gray-800 text-sm">
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>Comprehensive service overview</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>Expert team profiles</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>Market insights and trends</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>Contact information and locations</span>
                    </li>
                  </ul>
                </div>

                {/* Right Side */}
                <div className="text-center bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-center mb-4">
                    <FaFilePdf className="text-purple-600 text-4xl" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Inhabit Realties Brochure</h4>
                  <p className="text-sm text-gray-600 mb-4">Comprehensive guide to our services</p>
                  <div className="text-sm text-gray-700 mb-4">
                    <p><strong>File Size:</strong> 2.4 MB</p>
                    <p><strong>Format:</strong> PDF</p>
                    <p><strong>Updated:</strong> Dec 2024</p>
                  </div>
                  <button
                    onClick={handleBrochureDownload}
                    className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition duration-200"
                  >
                    <FaDownload className="inline mr-2" />
                    Download Brochure
                  </button>
                  <p className="text-xs text-gray-500 mt-3">Free download • No registration required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsWithBrochure; 