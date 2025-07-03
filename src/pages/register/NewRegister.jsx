import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { AUTH_IMAGES } from '../../config/images';
import { RegisterProvider, useRegister } from '../../context/AuthContext';

const DEFAULT_ROLE_ID = '681632b6ab1624e874bb2dcf';

const NewRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useRegister();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    else if (!/^[A-Za-z]+$/.test(firstName)) newErrors.firstName = 'First name must contain only letters.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
    else if (!/^[A-Za-z]+$/.test(lastName)) newErrors.lastName = 'Last name must contain only letters.';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required.';
    else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Email is not valid.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    else if (!/[A-Z]/.test(password)) newErrors.password = 'Password must contain at least one uppercase letter.';
    else if (!/[a-z]/.test(password)) newErrors.password = 'Password must contain at least one lowercase letter.';
    else if (!/\d/.test(password)) newErrors.password = 'Password must contain at least one number.';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.password = 'Password must contain at least one special character.';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const userData = {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        role: DEFAULT_ROLE_ID,
      };
      await register(userData);
      toast.success('Account created successfully! Please sign in.');
      setFirstName(''); setLastName(''); setPhoneNumber(''); setEmail(''); setPassword(''); setConfirmPassword('');
      navigate('/login');
    } catch (err) {
      toast.error(err?.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Left Side - Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center order-2 lg:order-1">
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Inhabit Realties" className="h-14 sm:h-16" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Create Your Account
            </h2>
            <p className="text-center text-gray-500 mb-8 text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
              Sign up and find your perfect home.
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label htmlFor="firstName" className="block text-xs sm:text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2.5 sm:p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all duration-300">
                    <FaUser className="text-gray-400 mx-2" />
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full bg-transparent border-none outline-none text-gray-700 text-sm sm:text-base"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      autoFocus
                      required
                    />
                  </div>
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div className="w-1/2">
                  <label htmlFor="lastName" className="block text-xs sm:text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2.5 sm:p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all duration-300">
                    <FaUser className="text-gray-400 mx-2" />
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full bg-transparent border-none outline-none text-gray-700 text-sm sm:text-base"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      required
                    />
                  </div>
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-xs sm:text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2.5 sm:p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all duration-300">
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder={"Mobile Number"}
                    className="w-full bg-transparent border-none outline-none text-gray-700 text-sm sm:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    required
                    maxLength={10}
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2.5 sm:p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all duration-300">
                  <FaEnvelope className="text-gray-400 mx-2" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent border-none outline-none text-gray-700 text-sm sm:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    required
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2.5 sm:p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all duration-300 relative">
                  <FaLock className="text-gray-400 mx-2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-none outline-none text-gray-700 text-sm sm:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    required
                  />
                  <span className="absolute right-3 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-2.5 sm:p-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all duration-300 relative">
                  <FaLock className="text-gray-400 mx-2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-none outline-none text-gray-700 text-sm sm:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    required
                  />
                  <span className="absolute right-3 cursor-pointer" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white font-bold text-base py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>
            </form>

            <p className="text-center text-gray-500 mt-8 text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
                Sign In
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
        <div className="hidden lg:block relative overflow-hidden order-1 lg:order-2">
          <img
            src={AUTH_IMAGES.register}
            alt="Modern Interior"
            className="w-full h-full object-cover transform transition-transform duration-[20s] ease-out hover:scale-125 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-10 left-10 text-white p-4">
            <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your New Beginning<br/>Starts Here
            </h2>
            <p className="mt-4 text-gray-200 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              Exceptional properties for an exceptional life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RegisterWithProvider(props) {
  return (
    <RegisterProvider>
      <NewRegister {...props} />
    </RegisterProvider>
  );
}