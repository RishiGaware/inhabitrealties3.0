// Utility functions for handling file exports

/**
 * Download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename for the download
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions with key and header
 * @param {string} filename - The filename for the download
 */
export const exportToCSV = (data, columns, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create CSV header
  const headers = columns.map(col => col.header).join(',');
  
  // Create CSV rows
  const rows = data.map(row => 
    columns.map(col => {
      let value = row[col.key];
      // Handle nested objects and arrays
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Format currency for display
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '-';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `$${parseFloat(amount).toFixed(2)}`;
  }
};

/**
 * Format date for display
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return date;
  }
};

/**
 * Generate filename with timestamp
 * @param {string} prefix - The filename prefix
 * @param {string} extension - The file extension
 * @returns {string} Generated filename
 */
export const generateFilename = (prefix, extension) => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `${prefix}_${timestamp}.${extension}`;
}; 