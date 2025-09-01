// Deployment utility to handle environment differences
export const isProduction = () => {
  return process.env.NODE_ENV === 'production' || 
         window.location.hostname !== 'localhost';
};

export const isDemoMode = () => {
  // Force demo mode in production or when API is not available
  return isProduction() || 
         !process.env.REACT_APP_API_URL ||
         window.location.pathname.includes('demo');
};

export const shouldUseSampleData = () => {
  // Use sample data in demo mode or production
  return isDemoMode() || isProduction();
};

export const getApiTimeout = () => {
  // Shorter timeout in production to fail fast and use sample data
  return isProduction() ? 3000 : 10000;
};

// Wrap API calls with fallback to sample data
export const fetchWithFallback = async (url, options = {}) => {
  if (shouldUseSampleData()) {
    throw new Error('Using sample data in demo mode');
  }
  
  const timeoutMs = getApiTimeout();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export default {
  isProduction,
  isDemoMode,
  shouldUseSampleData,
  getApiTimeout,
  fetchWithFallback
};
