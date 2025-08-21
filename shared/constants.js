// Shared configuration for the Nexum Obscura project

export const APP_CONFIG = {
  name: 'Nexum Obscura',
  version: '1.0.0',
  description: 'Cybersecurity Log Analysis Platform'
};

export const API_ENDPOINTS = {
  upload: '/upload',
  search: '/search',
  analysis: '/analysis',
  reports: '/reports',
  health: '/health'
};

export const SUSPICION_LEVELS = {
  LOW: { min: 0, max: 29, color: 'green', label: 'Low Risk' },
  MEDIUM: { min: 30, max: 49, color: 'yellow', label: 'Medium Risk' },
  HIGH: { min: 50, max: 69, color: 'orange', label: 'High Risk' },
  CRITICAL: { min: 70, max: 100, color: 'red', label: 'Critical Risk' }
};

export const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'FTP', 'SSH'];

export const ACTIONS = ['ALLOW', 'DENY', 'BLOCK', 'DROP'];

export const TIME_RANGES = [
  { value: '1h', label: 'Last 1 Hour', hours: 1 },
  { value: '6h', label: 'Last 6 Hours', hours: 6 },
  { value: '24h', label: 'Last 24 Hours', hours: 24 },
  { value: '7d', label: 'Last 7 Days', hours: 168 },
  { value: '30d', label: 'Last 30 Days', hours: 720 }
];

export const REPORT_TYPES = [
  { value: 'DAILY', label: 'Daily Report' },
  { value: 'WEEKLY', label: 'Weekly Report' },
  { value: 'MONTHLY', label: 'Monthly Report' },
  { value: 'INCIDENT', label: 'Incident Report' },
  { value: 'CUSTOM', label: 'Custom Report' }
];

export const CSV_HEADERS = [
  'timestamp',
  'source_ip',
  'dest_ip', 
  'source_port',
  'dest_port',
  'protocol',
  'action',
  'bytes',
  'packets'
];

export const ANOMALY_TYPES = {
  VOLUME_ANOMALY: { label: 'Volume Anomaly', icon: '📊' },
  PORT_SCAN: { label: 'Port Scanning', icon: '🔍' },
  PROTOCOL_ANOMALY: { label: 'Protocol Anomaly', icon: '🔄' },
  GEOGRAPHIC_ANOMALY: { label: 'Geographic Anomaly', icon: '🌍' },
  TIME_ANOMALY: { label: 'Time Anomaly', icon: '⏰' }
};

export default {
  APP_CONFIG,
  API_ENDPOINTS,
  SUSPICION_LEVELS,
  RISK_LEVELS,
  PROTOCOLS,
  ACTIONS,
  TIME_RANGES,
  REPORT_TYPES,
  CSV_HEADERS,
  ANOMALY_TYPES
};
