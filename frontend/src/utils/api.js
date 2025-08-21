import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  const response = await api.get('/search/logs', { params: filters });
  return response.data;
};

export const searchConnections = async (filters) => {
  const response = await api.get('/search/connections', { params: filters });
  return response.data;
};

export const getSuspiciousActivities = async (params = {}) => {
  const response = await api.get('/search/suspicious', { params });
  return response.data;
};

// Analysis API
export const getDashboardData = async (params = {}) => {
  const response = await api.get('/analysis/dashboard', { params });
  return response.data;
};

export const getPatterns = async (params = {}) => {
  const response = await api.get('/analysis/patterns', { params });
  return response.data;
};

export const getAnomalies = async (params = {}) => {
  const response = await api.get('/analysis/anomalies', { params });
  return response.data;
};

export const getTopologyData = async (params = {}) => {
  const response = await api.get('/analysis/topology', { params });
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
