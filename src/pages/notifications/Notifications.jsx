import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiInfo, FiAlertTriangle, FiCheckCircle, FiX } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import { notificationService } from '../../services/notifications/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// Play notification sound
const playNotificationSound = () => {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch {
    // Fallback: try using HTML5 audio if Web Audio API is not available
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGW57+efTQ8MTqTj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBhlue/nn00PDE6k4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch {
      // Ignore all audio errors
    }
  }
};

const getIconForType = (type) => {
  switch (type) {
    case 'meeting_schedule':
    case 'meeting_reminder':
      return { icon: <FiBell className="text-blue-500" />, color: 'bg-blue-100' };
    case 'lead_assignment':
    case 'lead_created':
      return { icon: <FiCheckCircle className="text-green-500" />, color: 'bg-green-100' };
    case 'contact_us':
    case 'inquiry_created':
      return { icon: <FiAlertTriangle className="text-orange-500" />, color: 'bg-orange-100' };
    case 'message':
      return { icon: <FiInfo className="text-purple-500" />, color: 'bg-purple-100' };
    default:
      return { icon: <FiBell className="text-gray-500" />, color: 'bg-gray-100' };
  }
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onNavigate }) => {
  const { icon, color } = getIconForType(notification.type);
  const isUnread = !notification.isRead;
  
  const handleClick = async () => {
    if (isUnread) {
      try {
        await onMarkAsRead(notification._id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    // Navigate based on notification type
    if (onNavigate) {
      onNavigate(notification);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await onDelete(notification._id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div 
      className={`flex items-start space-x-4 p-4 w-full cursor-pointer hover:bg-gray-50 transition-colors ${isUnread ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      <div className={`p-2 rounded-full ${color} flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`font-semibold ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
              {isUnread && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>}
            </p>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-1">{formatTime(notification.createdAt)}</p>
          </div>
          <button
            onClick={handleDelete}
            className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
            aria-label="Delete notification"
          >
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Get icon component for toast
const getToastIcon = (type) => {
  switch (type) {
    case 'meeting_schedule':
    case 'meeting_reminder':
      return <FiBell className="text-white w-5 h-5" />;
    case 'lead_assignment':
    case 'lead_created':
      return <FiCheckCircle className="text-white w-5 h-5" />;
    case 'contact_us':
    case 'inquiry_created':
      return <FiAlertTriangle className="text-white w-5 h-5" />;
    case 'message':
      return <FiInfo className="text-white w-5 h-5" />;
    default:
      return <FiBell className="text-white w-5 h-5" />;
  }
};

const Notifications = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { getUserRoleName } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const previousNotificationsRef = useRef([]);
  const pollingIntervalRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [allReadChecked, setAllReadChecked] = useState(false);

  // Handle navigation based on notification type and user role
  const handleNavigate = (notification) => {
    const roleName = getUserRoleName()?.toUpperCase();
    const notificationType = notification.type;

    // Close notification panel
    onClose();

    // Navigate based on notification type and role
    if (notificationType === 'lead_created' || notificationType === 'lead_assignment') {
      // All roles redirect to leads page
      navigate('/lead/add');
    } else if (notificationType === 'meeting_schedule' || notificationType === 'meeting_reminder') {
      // Navigate based on role
      if (roleName === 'ADMIN') {
        navigate('/admin-meetings');
      } else if (roleName === 'EXECUTIVE' || roleName === 'SALES') {
        navigate('/sales-meetings');
      } else {
        navigate('/my-meetings');
      }
    } else if (notificationType === 'inquiry_created' || notificationType === 'contact_us') {
      // Navigate to leads page for inquiries/contact
      if (roleName === 'ADMIN' || roleName === 'EXECUTIVE' || roleName === 'SALES') {
        navigate('/lead/add');
      }
    }
    // For other types, just close the panel
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Show toast notification
  const showToastNotification = (notification) => {
    const notificationType = notification.type;
    
    // Determine toast style based on notification type
    let toastStyle = {
      duration: 5000,
      style: {
        background: '#363636',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        maxWidth: '400px',
      },
    };

    // Customize based on notification type
    if (notificationType === 'lead_created' || notificationType === 'lead_assignment') {
      toastStyle.style.background = '#10B981'; // Green for leads
    } else if (notificationType === 'meeting_schedule' || notificationType === 'meeting_reminder') {
      toastStyle.style.background = '#3B82F6'; // Blue for meetings
    } else if (notificationType === 'inquiry_created' || notificationType === 'contact_us') {
      toastStyle.style.background = '#F59E0B'; // Orange for inquiries
    }

    // Create clickable toast
    toast(
      (t) => (
        <div 
          onClick={() => {
            toast.dismiss(t.id);
            // Mark as read if unread
            if (!notification.isRead) {
              handleMarkAsRead(notification._id).catch(err => console.error('Error marking as read:', err));
            }
            handleNavigate(notification);
          }}
          className="flex items-start space-x-3 cursor-pointer"
        >
          <div className="flex-shrink-0 mt-0.5">
            {getToastIcon(notificationType)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm leading-tight">{notification.title}</p>
            <p className="text-white text-xs mt-1 opacity-90 leading-tight">{notification.message}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
            }}
            className="flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ),
      {
        ...toastStyle,
      }
    );

    // Play sound
    playNotificationSound();
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getMyNotifications({ limit: 50 });
      if (response.success && response.data) {
        const newNotifications = response.data;
        
        // On first load, just store notifications without showing popups
        if (!isInitializedRef.current) {
          previousNotificationsRef.current = newNotifications;
          isInitializedRef.current = true;
          setNotifications(newNotifications);
          setLoading(false);
          return;
        }
        
        // Check for new notifications
        const previousIds = new Set(previousNotificationsRef.current.map(n => n._id));
        const newOnes = newNotifications.filter(n => !previousIds.has(n._id) && !n.isRead);
        
        // Show toast for each new notification
        if (newOnes.length > 0) {
          // Show all new notifications as toasts (with slight delay between them)
          newOnes.forEach((notification, index) => {
            setTimeout(() => {
              showToastNotification(notification);
            }, index * 500); // 500ms delay between each toast
          });
        }
        
        setNotifications(newNotifications);
        previousNotificationsRef.current = newNotifications;
        
        // Update unread count in navbar by triggering a custom event
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Poll for notifications every 30 seconds (always, not just when panel is open)
  useEffect(() => {
    // Initial fetch
    fetchNotifications();
    
    // Set up polling interval
    pollingIntervalRef.current = setInterval(() => {
      fetchNotifications();
    }, 30 * 1000); // 30 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount, not dependent on isOpen

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      previousNotificationsRef.current = previousNotificationsRef.current.filter(n => n._id !== notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async (checked) => {
    setAllReadChecked(checked);
    if (checked) {
      try {
        await notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        // Update unread count in navbar
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      } catch (error) {
        console.error('Error marking all as read:', error);
        setAllReadChecked(false);
      }
    }
  };

  // Update checkbox state when notifications change
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    setAllReadChecked(unreadCount === 0 && notifications.length > 0);
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allReadChecked}
                  onChange={(e) => handleMarkAllAsRead(e.target.checked)}
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                />
                <span className="text-xs text-gray-600 select-none">Mark all read</span>
              </label>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-4.5rem)] overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
              <FiBell className="w-12 h-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No notifications</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
