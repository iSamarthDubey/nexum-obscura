import axios from 'axios';

// Debug environment variables
console.log('🔧 Environment Variables:');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Determine API base URL
const getApiBaseUrl = () => {
  // If REACT_APP_API_URL is explicitly set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // In production, use Render
  return 'https://nexum-obscura.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🌐 Using API Base URL:', API_BASE_URL);

// Export the base URL for other components to use
export const API_URL = API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Upload API
export const uploadLogFile = async (file) => {
  const formData = new FormData();
  formData.append('logFile', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getUploadStatus = async () => {
  const response = await api.get('/upload/status');
  return response.data;
};

// Search API
export const searchLogs = async (filters) => {
  const response = await api.get('/logs', { params: filters });
  return response.data;
};

export const searchConnections = async (filters) => {
  const response = await api.get('/search/ipdr', { params: filters });
  return response.data;
};

export const getSuspiciousActivities = async (params = {}) => {
  const response = await api.get('/search/suspicious', { params });
  return response.data;
};

// Analysis API
export const getDashboardData = async (params = {}) => {
  const response = await api.get('/dashboard', { params });
  return response.data;
};

export const getPatterns = async (params = {}) => {
  const response = await api.get('/analysis', { params });
  return response.data;
};

export const getAnomalies = async (params = {}) => {
  const response = await api.get('/analysis', { params });
  return response.data;
};

export const getTopologyData = async (params = {}) => {
  const response = await api.get('/network', { params });
  return response.data;
};

// Reports API
export const getReports = async (params = {}) => {
  const response = await api.get('/reports', { params });
  return response.data;
};

export const getReportById = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const generateReport = async (reportData) => {
  const response = await api.post('/reports/generate', reportData);
  return response.data;
};

export const generateIncidentReport = async (incidentData) => {
  const response = await api.post('/reports/incident', incidentData);
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};

// Health check
export const checkApiHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Traffic Flow Analysis API
export const getTrafficFlowData = async (params = {}) => {
  const response = await api.get('/traffic-flow', { params });
  return response.data;
};

// Protocol Analysis API
export const getProtocolAnalysisData = async () => {
  const response = await api.get('/protocol-analysis');
  return response.data;
};

// Geographic Data API
export const getGeographicData = async () => {
  const response = await api.get('/geographic-data');
  return response.data;
};

// Dashboard specific API calls
export const fetchDashboardData = async (params = {}) => {
  try {
    const [dashboard, suspicious] = await Promise.all([
      getDashboardData(params),
      getSuspiciousActivities(params)
    ]);
    
    return {
      ...dashboard,
      suspiciousActivities: suspicious
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
};

export default api;
