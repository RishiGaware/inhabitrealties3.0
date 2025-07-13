import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../../assets/images/logo.png';
import logoWhite from '../../assets/images/logown.png';
import { IconButton, Box, Badge, Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverCloseButton, VStack, Text as ChakraText, HStack } from '@chakra-ui/react';
import { FiBell, FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useDisclosure } from '@chakra-ui/react';
import NotificationBar from './NotificationBar';

const notifications = [
  {
    id: 1,
    type: 'info',
    title: 'New Lead Assigned',
    description: 'A new lead "John Doe" has been assigned to you.',
    timestamp: '15 mins ago',
  },
  {
    id: 2,
    type: 'success',
    title: 'Property Sold!',
    description: 'Congratulations! The property "Sunset Villa" has been successfully sold.',
    timestamp: '1 hour ago',
  },
  {
    id: 3,
    type: 'warning',
    title: 'Upcoming Payment Due',
    description: 'Payment for "Oceanview Condo" is due in 3 days.',
    timestamp: '3 hours ago',
  },
  {
    id: 4,
    type: 'info',
    title: 'System Update',
    description: 'A new system update will be deployed tonight at 11 PM.',
    timestamp: '1 day ago',
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const Logo = () => (
    <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
      <img className="h-16 sm:h-30 w-auto" src={isScrolled ? logo : logoWhite} alt="Inhabit Realties" />
      <div className="font-extrabold hidden sm:block">
        {/* <h1 className="text-2xl sm:text-3xl tracking-tighter">INHABIT REALTIES</h1>
        <p className="text-sm sm:text-base font-light tracking-widest -mt-1">
          WE PRESENT YOUR DREAMS
        </p> */}
      </div>
    </Link>
  );

  const NavLinks = ({ inMobileMenu = false }) => (
    <div className={`flex ${inMobileMenu ? 'flex-col space-y-4 p-4' : 'items-center space-x-6'}`}>
      <Link
        to="/"
        onClick={closeMenu}
        className="group transition-colors relative"
        style={{ color: '#1E293B', fontWeight: 600, paddingBottom: 2 }}
      >
        <span
          style={{
            borderBottom: location.pathname === '/' ? '2.5px solid #D711DC' : '2.5px solid transparent',
            transition: 'border-color 0.2s',
            color: location.pathname === '/' ? '#D711DC' : undefined,
            paddingBottom: 2,
            display: 'inline-block',
          }}
          className="group-hover:border-b-2 group-hover:border-[#D711DC] group-hover:text-[#D711DC]"
        >
          Home
        </span>
      </Link>
      <Link
        to="/contact"
        onClick={closeMenu}
        className="group transition-colors relative"
        style={{ color: '#1E293B', fontWeight: 600, paddingBottom: 2 }}
      >
        <span
          style={{
            borderBottom: location.pathname === '/contact' ? '2.5px solid #D711DC' : '2.5px solid transparent',
            transition: 'border-color 0.2s',
            color: location.pathname === '/contact' ? '#D711DC' : undefined,
            paddingBottom: 2,
            display: 'inline-block',
          }}
          className="group-hover:border-b-2 group-hover:border-[#D711DC] group-hover:text-[#D711DC]"
        >
          Contact Us
        </span>
      </Link>
      <button
        onClick={() => {
          closeMenu();
          navigate('/login');
        }}
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
      >
        Sign In
      </button>
    </div>
  );

  const unreadCount = notifications.length;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md text-gray-800' : 'bg-transparent text-white'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Logo />
          <div className="hidden md:flex items-center gap-4">
            <NavLinks />
            {/* <Box position="relative" display="inline-block">
              <Tooltip label="Notifications" hasArrow>
                <IconButton
                  icon={<FiBell />}
                  aria-label="Notifications"
                  variant="ghost"
                  size="lg"
                  colorScheme="purple"
                  bg="white"
                  borderRadius="full"
                  boxShadow="sm"
                  _hover={{ bg: 'purple.50', boxShadow: 'md' }}
                  _active={{ bg: 'purple.100' }}
                  onClick={onOpen}
                />
              </Tooltip>
              {unreadCount > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="2px"
                  right="2px"
                  fontSize="0.7em"
                  px={2}
                  py={0.5}
                  boxShadow="0 0 0 2px white"
                  zIndex={1}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
              <NotificationBar isOpen={isOpen} onClose={onClose} notifications={notifications} />
            </Box> */}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out rounded-l-2xl text-gray-800 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Link to="/" onClick={closeMenu}>
            <img className="h-12 w-auto" src={logo} alt="Inhabit Realties" />
          </Link>
          <button onClick={closeMenu}>
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <NavLinks inMobileMenu />
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;