const express = require('express');
const router = express.Router();

// Mock data for OneView Dashboard endpoints
router.get('/logs', (req, res) => {
  const mockLogs = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      sourceIP: '192.168.1.100',
      destIP: '10.0.0.50',
      protocol: 'TCP',
      port: 443,
      suspicious: false,
      location: 'New York, US'
    },
    {
      id: '2', 
      timestamp: new Date().toISOString(),
      sourceIP: '203.0.113.45',
      destIP: '198.51.100.23',
      protocol: 'UDP',
      port: 53,
      suspicious: true,
      location: 'London, UK'
    },
    {
      id: '3',
      timestamp: new Date().toISOString(),
      sourceIP: '172.16.0.1',
      destIP: '192.0.2.146',
      protocol: 'TCP',
      port: 80,
      suspicious: false,
      location: 'Tokyo, JP'
    }
  ];
  
  res.json(mockLogs);
});

router.get('/anomalies', (req, res) => {
  const mockAnomalies = [
    {
      id: '1',
      type: 'Unusual Traffic Pattern',
      severity: 'High',
      timestamp: new Date().toISOString(),
      description: 'Suspicious data transfer detected',
      sourceIP: '203.0.113.45'
    },
    {
      id: '2',
      type: 'Port Scan',
      severity: 'Medium', 
      timestamp: new Date().toISOString(),
      description: 'Multiple port access attempts',
      sourceIP: '198.51.100.23'
    }
  ];
  
  res.json(mockAnomalies);
});

router.get('/geographic', (req, res) => {
  const mockGeoData = [
    {
      location: 'New York, US',
      latitude: 40.7128,
      longitude: -74.0060,
      count: 125,
      suspicious: 5
    },
    {
      location: 'London, UK',
      latitude: 51.5074,
      longitude: -0.1278,
      count: 87,
      suspicious: 12
    },
    {
      location: 'Tokyo, JP',
      latitude: 35.6762,
      longitude: 139.6503,
      count: 203,
      suspicious: 3
    },
    {
      location: 'Sydney, AU',
      latitude: -33.8688,
      longitude: 151.2093,
      count: 64,
      suspicious: 8
    }
  ];
  
  res.json(mockGeoData);
});

router.get('/protocols', (req, res) => {
  const mockProtocols = [
    { protocol: 'TCP', count: 1254, percentage: 62.7 },
    { protocol: 'UDP', count: 523, percentage: 26.2 },
    { protocol: 'ICMP', count: 187, percentage: 9.4 },
    { protocol: 'HTTP', count: 34, percentage: 1.7 }
  ];
  
  res.json(mockProtocols);
});

router.get('/network', (req, res) => {
  const mockNetwork = {
    nodes: [
      { id: '192.168.1.100', label: 'Server A', type: 'server' },
      { id: '192.168.1.101', label: 'Server B', type: 'server' },
      { id: '203.0.113.45', label: 'External IP', type: 'external' },
      { id: '10.0.0.50', label: 'Workstation', type: 'workstation' }
    ],
    edges: [
      { source: '192.168.1.100', target: '10.0.0.50', weight: 15 },
      { source: '203.0.113.45', target: '192.168.1.101', weight: 8 },
      { source: '192.168.1.101', target: '10.0.0.50', weight: 12 }
    ]
  };
  
  res.json(mockNetwork);
});

router.get('/stats', (req, res) => {
  const mockStats = {
    timeRange: 'Last 24 hours',
    dataProcessed: '2.4 GB',
    totalConnections: 1998,
    uniqueIPs: 156,
    averageLatency: '45ms',
    peakHour: '14:00 UTC',
    dataTransfer: {
      incoming: '1.2 GB',
      outgoing: '1.2 GB'
    }
  };
  
  res.json(mockStats);
});

module.exports = router;
