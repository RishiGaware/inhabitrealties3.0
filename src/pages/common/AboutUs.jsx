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

  // TEST: Simple console log to verify component is loading
  console.log('AboutUsWithBrochure component is loading with brochure!');

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

        {/* Enhanced Brochure Download Section */}
        <div ref={brochureRef} className="mt-8 lg:mt-12">
          <div
            className={`transition-all duration-1000 ${
              isBrochureVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Brochure Container */}
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 to-blue-600/15 rounded-xl"></div>
              
              {/* Main Content */}
              <div className="relative bg-white rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-purple-300 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
                  {/* Left Side - Content */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg">
                        <FaFilePdf className="text-white text-sm sm:text-lg" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Download Our Brochure
                        </h3>
                        <p className="text-purple-700 font-semibold text-xs sm:text-sm">Get detailed information about our services</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-800 text-xs sm:text-sm lg:text-base leading-relaxed font-medium">
                      Discover everything Inhabit Realties has to offer. Our comprehensive brochure includes detailed information about our services, team, and commitment to excellence in real estate.
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <FaCheckCircle className="text-green-600 text-xs sm:text-sm flex-shrink-0" />
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">Comprehensive service overview</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <FaCheckCircle className="text-green-600 text-xs sm:text-sm flex-shrink-0" />
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">Expert team profiles</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <FaCheckCircle className="text-green-600 text-xs sm:text-sm flex-shrink-0" />
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">Market insights and trends</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <FaCheckCircle className="text-green-600 text-xs sm:text-sm flex-shrink-0" />
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">Contact information and locations</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Download Card */}
                  <div className="relative">
                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <FaStar className="text-white text-xs" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    
                    {/* Download Card */}
                    <div className="bg-gradient-to-br from-purple-700 via-blue-700 to-indigo-800 rounded-lg p-3 sm:p-4 text-white shadow-xl transform hover:scale-105 transition-all duration-500 border border-white/20">
                      <div className="text-center space-y-2 sm:space-y-3">
                        {/* Brochure Preview Image */}
                        <div className="flex justify-center">
                          <div className="relative w-16 h-20 sm:w-20 sm:h-24 lg:w-24 lg:h-28 bg-gradient-to-br from-purple-600 to-blue-700 rounded-lg border-2 border-white/50 overflow-hidden shadow-xl">
                            {/* Real Estate Brochure Image */}
                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center relative">
                              {/* Background Pattern */}
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-blue-600/40"></div>
                              
                              {/* Brochure Content Layout */}
                              <div className="relative z-10 w-full h-full flex flex-col">
                                {/* Header Section */}
                                <div className="bg-white/30 backdrop-blur-sm p-1 text-center border-b border-white/20">
                                  <div className="text-white text-xs font-bold">INHABIT</div>
                                  <div className="text-white/90 text-xs">REALTIES</div>
                                </div>
                                
                                {/* Main Content Area */}
                                <div className="flex-1 p-1">
                                  {/* Property Image Placeholder */}
                                  <div className="w-full h-6 sm:h-7 bg-gradient-to-br from-green-500 to-blue-600 rounded mb-1 flex items-center justify-center border border-white/30">
                                    <FaBuilding className="text-white text-xs sm:text-sm" />
                                  </div>
                                  
                                  {/* Content Sections */}
                                  <div className="space-y-0.5 sm:space-y-1">
                                    <div className="bg-white/40 rounded px-1 py-0.5 flex items-center border border-white/20">
                                      <FaHome className="text-white text-xs mr-1" />
                                      <div className="text-white text-xs font-semibold">Premium</div>
                                    </div>
                                    <div className="bg-white/40 rounded px-1 py-0.5 flex items-center border border-white/20">
                                      <FaUserFriends className="text-white text-xs mr-1" />
                                      <div className="text-white text-xs">Agents</div>
                                    </div>
                                    <div className="bg-white/40 rounded px-1 py-0.5 flex items-center border border-white/20">
                                      <FaChartLine className="text-white text-xs mr-1" />
                                      <div className="text-white text-xs">Insights</div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Footer Section */}
                                <div className="bg-black/60 backdrop-blur-sm p-1 text-center border-t border-white/20">
                                  <div className="text-white text-xs font-semibold">2024</div>
                                </div>
                              </div>
                              
                              {/* Decorative Elements */}
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/80 rounded-full shadow-sm"></div>
                              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white/60 rounded-full shadow-sm"></div>
                              <div className="absolute top-1/3 left-1 w-1 h-1 bg-white/40 rounded-full"></div>
                              <div className="absolute bottom-1/3 right-1 w-1 h-1 bg-white/40 rounded-full"></div>
                            </div>
                            
                            {/* Overlay with file info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-1 border-t border-white/20">
                              <div className="text-white text-xs">
                                <div className="flex justify-between">
                                  <span>Size:</span>
                                  <span className="font-semibold">2.4 MB</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Format:</span>
                                  <span className="font-semibold">PDF</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div>
                          <h4 className="text-sm sm:text-base font-bold mb-1">Inhabit Realties Brochure</h4>
                          <p className="text-purple-100 text-xs mb-2">Comprehensive guide to our services</p>
                          
                          {/* File Info */}
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mb-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>File Size:</span>
                              <span className="font-semibold">2.4 MB</span>
                            </div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Format:</span>
                              <span className="font-semibold">PDF</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>Updated:</span>
                              <span className="font-semibold">Dec 2024</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={handleBrochureDownload}
                            className="w-full bg-white text-purple-600 font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group text-xs sm:text-sm"
                          >
                            <FaDownload className="text-xs sm:text-sm group-hover:animate-bounce" />
                            <span>Download Brochure</span>
                          </button>
                          
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-white/20 backdrop-blur-sm text-white py-1.5 px-2 rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-1 text-xs">
                              <FaEye className="text-xs" />
                              <span>Preview</span>
                            </button>
                            <button className="flex-1 bg-white/20 backdrop-blur-sm text-white py-1.5 px-2 rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-1 text-xs">
                              <FaShare className="text-xs" />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Additional Info */}
                        <p className="text-purple-200 text-xs">
                          Free download • No registration required
                        </p>
                      </div>
                    </div>
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

export default AboutUsWithBrochure; 