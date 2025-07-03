import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import { AUTH_IMAGES } from '../../config/images';

const NewLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showErrorToast('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await login({ email, password });
      
      // Check if login was successful
      if (result && result.data) {
        showSuccessToast('Sign in successful! Welcome back.');
        navigate('/dashboard');
      } else {
        showErrorToast('Sign in failed. Please try again.');
      }
    } catch (error) {
      // Handle different types of errors
      if (error && error.message) {
        showErrorToast(error.message);
      } else if (error && error.error) {
        showErrorToast(error.error);
      } else if (error && error.status === 401) {
        showErrorToast('Invalid username or password. Please check your credentials.');
      } else if (error && error.status === 404) {
        showErrorToast('User not found. Please check your username.');
      } else if (error && error.status === 500) {
        showErrorToast('Server error. Please try again later.');
      } else if (error && error.status >= 400 && error.status < 500) {
        showErrorToast('Invalid request. Please check your input.');
      } else if (error && error.status >= 500) {
        showErrorToast('Server error. Please try again later.');
      } else {
        showErrorToast('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Left Side - Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Inhabit Realties" className="h-14 sm:h-16" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 mb-8 text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
              Sign in to continue your journey.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Username
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2.5 sm:p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all duration-300">
                  <FaUser className="text-gray-400 mx-2" />
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your_username"
                    className="w-full bg-transparent border-none outline-none text-gray-700 text-sm sm:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    autoFocus
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Forgot Password?
                  </Link>
                </div>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2.5 sm:p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all duration-300">
                  <FaLock className="text-gray-400 mx-2" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-none outline-none text-gray-700 text-sm sm:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white font-bold text-base py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <p className="text-center text-gray-500 mt-8 text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
                Sign Up
              </Link>
            </p>

            <div className="mt-4 text-center">
              <Link to="/" className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-purple-700 transition-colors flex items-center justify-center">
                <FiArrowLeft className="mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block relative overflow-hidden">
          <img
            src={AUTH_IMAGES.login}
            alt="Luxury Home"
            className="w-full h-full object-cover transform transition-transform duration-[20s] ease-out hover:scale-125 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-10 left-10 p-4">
            <h2 className="text-4xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Find Your Exclusive<br/>Dream Home
            </h2>
            <p className="mt-4 text-gray-200 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              Step into a world of luxury and comfort.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLogin;