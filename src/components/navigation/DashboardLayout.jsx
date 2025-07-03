import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Notifications from "../../pages/notifications/Notifications";
import { useLocation } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme/theme';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [subMenus, setSubMenus] = useState({});
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize submenus based on current route
  useEffect(() => {
    const path = location.pathname.split('/');
    if (path[1] && path[2]) {
      // If we're on a submenu page, ensure the parent menu is expanded
      const parentKey = path[1];
      if (!subMenus[parentKey]) {
        setSubMenus(prev => ({
          ...prev,
          [parentKey]: true
        }));
      }
    }
  }, [location.pathname]);

  const toggleSubMenu = (menuKey) => {
    setSubMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleMobileOpen = () => {
    setSidebarOpen(true);
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(true);
  };

  const handleNotificationClose = () => {
    setIsNotificationsOpen(false);
  };

  return (
    <ChakraProvider theme={theme}>
      <div className="min-h-screen bg-gray-100">
        <Sidebar 
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          subMenus={subMenus}
          toggleSubMenu={toggleSubMenu}
          isMobile={isMobile}
        />
        
        <Navbar 
          onMobileOpen={handleMobileOpen} 
          onNotificationClick={handleNotificationClick}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className={`transition-all duration-300 ease-in-out p-4 ${isMobile ? 'ml-0' : (sidebarOpen ? 'ml-72' : 'ml-20')}`}>
          {children}
        </div>

        <Notifications 
          isOpen={isNotificationsOpen} 
          onClose={handleNotificationClose} 
        />
      </div>
    </ChakraProvider>
  );
};

export default DashboardLayout; 