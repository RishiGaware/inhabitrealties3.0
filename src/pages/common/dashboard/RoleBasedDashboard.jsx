import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDemo } from '../../../context/DemoContext';
import { USER_ROLES } from '../../../utils/constants';

const RoleBasedDashboard = () => {
  const { getUserRole, getUserName } = useAuth();
  const { isDemoMode, getDemoRole } = useDemo();
  
  const userRole = isDemoMode ? (getDemoRole() || 'USER') : getUserRole();
  const userName = isDemoMode ? 'Demo User' : getUserName();

  const getDashboardContent = () => {
    switch (userRole) {
      case USER_ROLES.ADMIN:
        return {
          title: 'Admin Dashboard',
          description: 'Complete system overview and management',
          features: [
            'User Management & Role Assignment',
            'System Configuration & Settings',
            'Complete Financial Overview',
            'All Bookings & Payments',
            'System Reports & Analytics',
            'Document Management'
          ]
        };
      
      case USER_ROLES.SALES:
        return {
          title: 'Sales Dashboard',
          description: 'Personal booking overview and customer management',
          features: [
            'My Assigned Bookings',
            'Customer Profiles',
            'Lead Management',
            'Payment Recording',
            'Personal Performance Metrics',
            'Meeting Schedules'
          ]
        };
      
      case USER_ROLES.EXECUTIVE:
        return {
          title: 'Executive Dashboard',
          description: 'Financial overview and strategic insights',
          features: [
            'Financial Performance Overview',
            'Payment Approvals & Reconciliation',
            'Strategic Reports & Analytics',
            'Executive Summary',
            'Key Performance Indicators',
            'Decision Support Data'
          ]
        };
      
      case USER_ROLES.CLIENT:
        return {
          title: 'Client Portal',
          description: 'Your personal real estate dashboard',
          features: [
            'My Bookings & Properties',
            'Payment History',
            'Document Access',
            'Meeting Schedules',
            'Property Favorites',
            'Support & Referrals'
          ]
        };
      
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to Inhabit Realties',
          features: [
            'Please contact administrator for role assignment',
            'System access will be configured based on your role'
          ]
        };
    }
  };

  const content = getDashboardContent();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {userName || 'User'}!
        </h1>
        <p className="text-gray-600">
          Role: <span className="font-semibold text-blue-600">{userRole || 'Not Assigned'}</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{content.title}</h2>
        <p className="text-gray-600 mb-6">{content.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.features.map((feature, index) => (
            <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">{feature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Role-Based Access Control</h3>
        <p className="text-yellow-700 text-sm">
          This dashboard automatically adapts based on your assigned role. 
          {userRole === USER_ROLES.ADMIN && ' As an Admin, you have access to all system modules.'}
          {userRole === USER_ROLES.SALES && ' As a Sales personnel, you can manage your assigned bookings and customers.'}
          {userRole === USER_ROLES.EXECUTIVE && ' As an Executive, you have financial overview and approval capabilities.'}
          {userRole === USER_ROLES.CLIENT && ' As a Client, you can access your personal portal and property information.'}
        </p>
      </div>
    </div>
  );
};

export default RoleBasedDashboard; 