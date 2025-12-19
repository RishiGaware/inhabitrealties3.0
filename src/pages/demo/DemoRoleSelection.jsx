import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import {
  FaUserShield,
  FaUserTie,
  FaUser,
  FaUserCircle,
  FaBuilding,
} from 'react-icons/fa';

// NOTE: This component assumes you have Tailwind CSS set up.

const DemoRoleSelection = () => {
  const navigate = useNavigate();
  // Assume useDemo provides 'startDemo'
  const { startDemo } = useDemo();

  // Defined roles with their associated Tailwind color schemes
  const roles = [
    {
      id: 'ADMIN',
      name: 'Admin',
      description: 'Full system access with all permissions and configurations.',
      icon: FaUserShield,
      color: 'indigo', // Changed from purple for a standard Tailwind color
      dashboardRoute: '/demo/dashboard',
    },
    {
      id: 'EXECUTIVE',
      name: 'Executive',
      description: 'High-level financial overview, reporting, and key approvals.',
      icon: FaBuilding,
      color: 'green',
      dashboardRoute: '/demo/executive-dashboard',
    },
    {
      id: 'SALES',
      name: 'Sales',
      description: 'Access to leads, CRM tools, and limited operational features.',
      icon: FaUserTie,
      color: 'blue',
      dashboardRoute: '/demo/sales-dashboard',
    },
    {
      id: 'CLIENT',
      name: 'Client',
      description: 'Dedicated client portal for tracking orders and communication.',
      icon: FaUserCircle,
      color: 'orange',
      dashboardRoute: '/demo/user-dashboard',
    },
    {
      id: 'USER',
      name: 'Standard User',
      description: 'Limited access with essential, day-to-day functional modules.',
      icon: FaUser,
      color: 'teal',
      dashboardRoute: '/demo/user-dashboard',
    },
  ];

  const handleRoleSelect = (role) => {
    startDemo(role.id);
    navigate(role.dashboardRoute);
  };

  /**
   * Helper function to dynamically map role colors to full, safe Tailwind classes.
   * This ensures the Tailwind JIT compiler finds the classes.
   */
  const getRoleClasses = (colorScheme) => {
    switch (colorScheme) {
      case 'indigo':
        return {
          iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-400',
          hoverBorder: 'hover:border-indigo-500',
          hoverShadow: 'hover:shadow-xl hover:shadow-indigo-500/20',
          buttonClass: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
        };
      case 'green':
        return {
          iconBg: 'bg-gradient-to-br from-green-500 to-green-700 shadow-green-400',
          hoverBorder: 'hover:border-green-500',
          hoverShadow: 'hover:shadow-xl hover:shadow-green-500/20',
          buttonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        };
      case 'blue':
        return {
          iconBg: 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-400',
          hoverBorder: 'hover:border-blue-500',
          hoverShadow: 'hover:shadow-xl hover:shadow-blue-500/20',
          buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        };
      case 'orange':
        return {
          iconBg: 'bg-gradient-to-br from-orange-500 to-orange-700 shadow-orange-400',
          hoverBorder: 'hover:border-orange-500',
          hoverShadow: 'hover:shadow-xl hover:shadow-orange-500/20',
          buttonClass: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
        };
      case 'teal':
      default:
        return {
          iconBg: 'bg-gradient-to-br from-teal-500 to-teal-700 shadow-teal-400',
          hoverBorder: 'hover:border-teal-500',
          hoverShadow: 'hover:shadow-xl hover:shadow-teal-500/20',
          buttonClass: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500',
        };
    }
  };

  const RoleCard = ({ role }) => {
    const classes = getRoleClasses(role.color);

    return (
      <div
        className={`
          flex flex-col p-5 sm:p-6 bg-white rounded-lg shadow-md border border-gray-100 
          transition-all duration-300 ease-in-out cursor-pointer group
          transform hover:-translate-y-1 
          ${classes.hoverBorder}
          ${classes.hoverShadow}
        `}
        onClick={() => handleRoleSelect(role)}
      >
        <div className="flex flex-col items-center justify-center space-y-3 h-full">
          {/* Icon Box (Slightly reduced size) */}
          <div
            className={`
              w-14 h-14 min-w-14 min-h-14 rounded-full flex items-center justify-center 
              shadow-lg mb-1 transition-transform duration-300
              ${classes.iconBg} 
              group-hover:scale-105
            `}
          >
            <role.icon className="w-6 h-6 text-white" />
          </div>

          {/* Role Title */}
          <h3 className="text-lg font-bold text-gray-800 text-center mt-1">
            {role.name}
          </h3>

          {/* Description (Smaller font for card density) */}
          <p className="text-sm text-gray-600 text-center flex-grow mb-2">
            {role.description}
          </p>

          {/* Button */}
          <button
            type="button"
            className={`
              w-full py-2.5 px-3 text-sm text-white font-semibold rounded-md 
              transition-colors duration-200 ease-in-out shadow-sm
              ${classes.buttonClass} 
              focus:outline-none focus:ring-4 focus:ring-opacity-50
            `}
            onClick={(e) => {
              e.stopPropagation();
              handleRoleSelect(role);
            }}
          >
            Start Demo
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16 mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 md:mb-14 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center">
            🚀 Demo Mode - Select Your Role
          </h1>
          <p className="text-md text-gray-600 text-center max-w-2xl">
            Choose a persona to explore the system's features and permissions. All data is static and for demonstration purposes only.
          </p>
        </div>

        {/* Roles Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoRoleSelection;