import React, { useState, useEffect } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";
import LogoutButton from "../common/LogoutButton";
import { notificationService } from "../../services/notifications/notificationService";

import { useDemo } from "../../context/DemoContext";

const Navbar = ({ onNotificationClick, onMobileOpen, sidebarOpen, setSidebarOpen }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isDemoMode } = useDemo();

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (isDemoMode) {
      setUnreadCount(5); // Static count for demo
      return;
    }
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success && response.data) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Fetch on mount and poll every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30 * 1000); // 30 seconds
    
    // Listen for notification updates
    const handleNotificationUpdate = () => {
      fetchUnreadCount();
    };
    window.addEventListener('notificationsUpdated', handleNotificationUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationsUpdated', handleNotificationUpdate);
    };
  }, []);

  return (
    <div className="flex items-center justify-between w-full px-4 bg-white border-b border-gray-200 h-14">
      <div className="flex items-center gap-4">
        <button
          className="inline-flex md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={onMobileOpen}
          aria-label="Menu"
        >
          <FaBars className="w-4 h-4" />
        </button>
        
        {/* Desktop toggle button */}
        <button
          className="hidden md:inline-flex p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <FaBars className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={onNotificationClick}
          aria-label="Notifications"
        >
          <FaBell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        
        <RouterLink to="/profile" className="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <CgProfile className="w-6 h-6 cursor-pointer" />
        </RouterLink>
        
        {/* Logout Button */}
        <div className="hidden sm:block">
          <LogoutButton size="sm" />
        </div>
        
        {/* Mobile Logout Button */}
        <div className="sm:hidden">
          <LogoutButton size="xs" />
        </div>
      </div>
    </div>
  );
};

export default Navbar; 