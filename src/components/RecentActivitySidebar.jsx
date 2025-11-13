import React from 'react';
import { FiUser, FiEye, FiArrowUpRight } from 'react-icons/fi';

const RecentActivitySidebar = () => {
  // For now, this is a simple guest user activity card
  // In the future, this can be connected to actual user activity data
  const viewedCount = 0; // This can be fetched from localStorage or API

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <FiUser className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Guest User</p>
          <p className="text-xs text-gray-500">Not signed in</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Your Recent Activity</h3>
        
        {/* Viewed Properties */}
        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
            <span className="text-xl font-bold text-orange-600">{viewedCount}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FiEye className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">Viewed</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Properties you've viewed</p>
          </div>
          <FiArrowUpRight className="w-4 h-4 text-orange-600" />
        </div>

        {/* Sign In Prompt */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-sm text-gray-700 mb-3">
            Sign in to track your property searches and get personalized recommendations
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors text-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivitySidebar;


