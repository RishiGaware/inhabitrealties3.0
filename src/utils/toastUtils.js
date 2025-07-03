import toast from 'react-hot-toast';

// Centralized toast configuration
const toastConfig = {
  duration: 4000,
  style: {
    background: '#363636',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
};

const successConfig = {
  ...toastConfig,
  duration: 3000,
  style: {
    ...toastConfig.style,
    background: '#10B981',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#10B981',
  },
};

const errorConfig = {
  ...toastConfig,
  duration: 4000,
  style: {
    ...toastConfig.style,
    background: '#EF4444',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#EF4444',
  },
};

const loadingConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: '#3B82F6',
    color: '#fff',
  },
};

// Centralized toast functions
export const showToast = {
  success: (message) => toast.success(message, successConfig),
  error: (message) => toast.error(message, errorConfig),
  info: (message) => toast(message, toastConfig),
  warning: (message) => toast(message, { ...toastConfig, style: { ...toastConfig.style, background: '#F59E0B' } }),
  loading: (message) => toast.loading(message, loadingConfig),
  dismiss: (toastId) => toast.dismiss(toastId),
};

// Helper functions for common scenarios
export const showSuccessToast = (message) => showToast.success(message);
export const showErrorToast = (message) => showToast.error(message);
export const showInfoToast = (message) => showToast.info(message);
export const showWarningToast = (message) => showToast.warning(message);
export const showLoadingToast = (message) => showToast.loading(message);

// Promise-based toast helpers
export const toastPromise = (promise, messages) => {
  return toast.promise(promise, messages, {
    ...toastConfig,
    success: successConfig,
    error: errorConfig,
    loading: loadingConfig,
  });
};

export default showToast; 