import React from 'react';
import { FiBell, FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';

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

const getIconForType = (type) => {
    switch (type) {
      case 'info':
        return { icon: <FiInfo className="text-blue-500" />, color: 'bg-blue-100' };
      case 'success':
        return { icon: <FiCheckCircle className="text-green-500" />, color: 'bg-green-100' };
      case 'warning':
        return { icon: <FiAlertTriangle className="text-orange-500" />, color: 'bg-orange-100' };
      default:
        return { icon: <FiBell className="text-gray-500" />, color: 'bg-gray-100' };
    }
};

const NotificationItem = ({ type, title, description, timestamp }) => {
    const { icon, color } = getIconForType(type);
    return (
        <div className="flex items-start space-x-4 p-4 w-full">
            <div className={`p-2 rounded-full ${color}`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{description}</p>
                <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
            </div>
        </div>
    )
}

const Notifications = ({ isOpen, onClose }) => {
  return (
    <>
        {/* Overlay */}
        <div 
            className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        />
        {/* Panel */}
        <div 
            className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                    <FaTimes />
                </button>
            </div>

            <div className="h-[calc(100%-4.5rem)] overflow-y-auto">
                {notifications.length > 0 ? (
                    <div className="divide-y">
                        {notifications.map((notification) => (
                            <NotificationItem key={notification.id} {...notification} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-10">
                        <FiBell className="w-12 h-12 text-gray-300" />
                        <p className="mt-4 text-gray-500">No new notifications</p>
                    </div>
                )}
            </div>
        </div>
    </>
  );
};

export default Notifications; 