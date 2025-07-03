import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaRegCommentDots, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { FiArrowLeft, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useOnScreen from '../../hooks/useOnScreen';
import toast from 'react-hot-toast';
import { submitContactUs } from '../../services/homeservices/homeService';

const Contact = () => {
  const navigate = useNavigate();
  const [formRef, isFormVisible] = useOnScreen({ threshold: 0.2 });
  const [infoRef, isInfoVisible] = useOnScreen({ threshold: 0.2 });
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await submitContactUs({ name, email, phone, description: message });
      toast.success('Message sent successfully!');
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (err) {
      toast.error(err?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-2xl sm:text-3xl font-bold text-gray-800"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Get in Touch
          </h1>
          <p
            className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We'd love to hear from you. Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <div
            ref={formRef}
            className={`lg:col-span-2 bg-white p-4 sm:p-5 rounded-md shadow-md border border-gray-100 transition-all duration-1000 ${
              isFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <h2
              className="text-base sm:text-lg font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Send us a Message
            </h2>
            <p className="text-gray-600 mb-3 text-xs sm:text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our team will get back to you within 24 hours.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Your Name</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-2 focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600 transition-all duration-300">
                  <FaUser className="text-gray-400 mr-2 text-sm" />
                  <input type="text" name="name" id="name" placeholder="John Doe" className="w-full bg-transparent border-none outline-none text-gray-800 text-xs sm:text-sm" style={{ fontFamily: "'Inter', sans-serif" }} value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Phone Number</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-2 focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600 transition-all duration-300">
                  <FaPhone className="text-gray-400 mr-2 text-sm" />
                  <input type="tel" name="phone" id="phone" placeholder="(555) 123-4567" className="w-full bg-transparent border-none outline-none text-gray-800 text-xs sm:text-sm" style={{ fontFamily: "'Inter', sans-serif" }} value={phone} onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(val);
                  }} maxLength={10} />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Your Email</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-2 focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600 transition-all duration-300">
                  <FaEnvelope className="text-gray-400 mr-2 text-sm" />
                  <input type="email" name="email" id="email" placeholder="you@example.com" className="w-full bg-transparent border-none outline-none text-gray-800 text-xs sm:text-sm" style={{ fontFamily: "'Inter', sans-serif" }} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Your Message</label>
                <div className="flex items-start bg-gray-50 border border-gray-200 rounded-md p-2 focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600 transition-all duration-300">
                  <FaRegCommentDots className="text-gray-400 mr-2 mt-1 text-sm" />
                  <textarea name="message" id="message" rows="4" placeholder="Your Message..." className="w-full bg-transparent border-none outline-none text-gray-800 text-xs sm:text-sm resize-none" style={{ fontFamily: "'Inter', sans-serif" }} value={message} onChange={e => setMessage(e.target.value)}></textarea>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white font-semibold text-xs sm:text-sm py-2 px-4 rounded-md hover:bg-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-xs sm:text-sm font-bold text-center text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Operating Hours
              </h3>
              <div className="text-center text-gray-600 text-xs sm:text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Information & Navigation */}
          <div
            ref={infoRef}
            className={`space-y-4 transition-all duration-1000 delay-200 ${
              isInfoVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="bg-white p-4 rounded-md shadow-md border border-gray-100">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Information</h3>
              <div className="space-y-3 text-gray-700 text-xs sm:text-sm">
                <p className="flex items-center">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2 text-purple-600" />
                  <span>123 Real Estate St, New York, NY 10001</span>
                </p>
                <p className="flex items-center">
                  <FaEnvelope className="w-4 h-4 mr-2 text-purple-600" />
                  <span>support@inhabit.com</span>
                </p>
                <p className="flex items-center">
                  <FaPhone className="w-4 h-4 mr-2 text-purple-600" />
                  <span>+1 (555) 123-4567</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md shadow-md border border-gray-100">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Move to</h3>
              <div className="space-y-2">
                <button onClick={() => navigate('/')} className="w-full flex items-center justify-center text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 py-2 px-3 rounded-md transition-all duration-300">
                  <FiArrowLeft className="mr-2" /> Go to Home
                </button>
                <button onClick={() => navigate('/login')} className="w-full flex items-center justify-center text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-md transition-all duration-300">
                  <FiLogIn className="mr-2" /> Login
                </button>
                <button onClick={() => navigate('/register')} className="w-full flex items-center justify-center text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 py-2 px-3 rounded-md transition-all duration-300">
                  <FiUserPlus className="mr-2" /> Register
                </button>
              </div>
            </div>

            <div className="bg-white rounded-md shadow-md border border-gray-100 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.220131835108!2d-73.98801558459388!3d40.74844097932824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e192a415a556!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1628882 Empire State Building"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 