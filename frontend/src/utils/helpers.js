// Format numbers with appropriate units
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format bytes to human readable format
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format date for input fields
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().slice(0, 16);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
};

// Get color for suspicion score
export const getSuspicionColor = (score) => {
  if (score >= 90) return 'text-red-600 bg-red-100';
  if (score >= 70) return 'text-orange-600 bg-orange-100';
  if (score >= 50) return 'text-yellow-600 bg-yellow-100';
  if (score >= 30) return 'text-blue-600 bg-blue-100';
  return 'text-green-600 bg-green-100';
};

// Get risk level from suspicion score
export const getRiskLevel = (score) => {
  if (score >= 90) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 50) return 'MEDIUM';
  return 'LOW';
};

// Get color for risk level
export const getRiskLevelColor = (level) => {
  const colors = {
    CRITICAL: 'text-red-600 bg-red-100',
    HIGH: 'text-orange-600 bg-orange-100',
    MEDIUM: 'text-yellow-600 bg-yellow-100',
    LOW: 'text-green-600 bg-green-100'
  };
  return colors[level] || colors.LOW;
};

// Validate IP address
export const isValidIP = (ip) => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;
  
  return ip.split('.').every(octet => {
    const num = parseInt(octet);
    return num >= 0 && num <= 255;
  });
};

// Check if IP is private
export const isPrivateIP = (ip) => {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./
  ];
  
  return privateRanges.some(range => range.test(ip));
};

// Generate random color for visualization
export const getRandomColor = (seed) => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  return colors[seed % colors.length];
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Calculate percentage
export const calculatePercentage = (part, total) => {
  if (total === 0) return 0;
  return ((part / total) * 100).toFixed(2);
};

// Generate CSV from data
export const generateCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text
export const truncate = (text, length = 50) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Get time range options
export const getTimeRangeOptions = () => [
  { value: '1', label: 'Last 1 Hour' },
  { value: '6', label: 'Last 6 Hours' },
  { value: '24', label: 'Last 24 Hours' },
  { value: '168', label: 'Last 7 Days' },
  { value: '720', label: 'Last 30 Days' }
];

// Get protocol color
export const getProtocolColor = (protocol) => {
  const colors = {
    TCP: '#3B82F6',
    UDP: '#10B981',
    HTTP: '#F59E0B',
    HTTPS: '#8B5CF6',
    FTP: '#EF4444',
    SSH: '#06B6D4',
    ICMP: '#84CC16'
  };
  return colors[protocol] || '#6B7280';
};

export default {
  formatNumber,
  formatBytes,
  formatDate,
  formatDateForInput,
  formatRelativeTime,
  getSuspicionColor,
  getRiskLevel,
  getRiskLevelColor,
  isValidIP,
  isPrivateIP,
  getRandomColor,
  debounce,
  calculatePercentage,
  generateCSV,
  capitalize,
  truncate,
  getTimeRangeOptions,
  getProtocolColor
};
