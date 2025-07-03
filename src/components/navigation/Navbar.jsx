import React from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";
import LogoutButton from "../common/LogoutButton";

const Navbar = ({ onNotificationClick, onMobileOpen, sidebarOpen, setSidebarOpen }) => {
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
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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