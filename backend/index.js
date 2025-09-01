const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Starting Nexum Obscura Backend...');

// Routes
try {
  app.use('/api/upload', require('./routes/upload'));
  console.log('✓ Upload route loaded');
} catch (error) {
  console.error('✗ Upload route failed:', error.message);
}

try {
  app.use('/api/search', require('./routes/search'));
  console.log('✓ Search route loaded');
} catch (error) {
  console.error('✗ Search route failed:', error.message);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Nexum Obscura API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Dashboard data endpoint
app.get('/api/dashboard', (req, res) => {
  res.json({
    overview: {
      totalRecords: 2847362,
      activeConnections: 15847,
      flaggedNumbers: 342,
      investigationCases: 28,
      suspiciousPatterns: 89,
      networkNodes: 5634,
      dataProcessed: "847.2",
      riskScore: 67
    },
    recentActivity: [
      { time: '14:32', event: 'Suspicious call pattern detected', level: 'high', source: '+91-98765-43210' },
      { time: '14:28', event: 'New IPDR batch processed', level: 'info', source: 'Operator: Airtel' },
      { time: '14:25', event: 'International roaming anomaly', level: 'medium', source: '+1-555-0123' },
      { time: '14:20', event: 'Bulk SMS activity flagged', level: 'high', source: '+91-87654-32109' },
    ],
    timeline: [
      { time: '00:00', calls: 1250, sms: 450, data: 890 },
      { time: '04:00', calls: 890, sms: 320, data: 670 },
      { time: '08:00', calls: 2340, sms: 890, data: 1450 },
      { time: '12:00', calls: 3450, sms: 1200, data: 2100 },
      { time: '16:00', calls: 2890, sms: 980, data: 1780 },
      { time: '20:00', calls: 2100, sms: 720, data: 1320 }
    ]
  });
});

app.listen(PORT, () => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://nexum-obscura.onrender.com` 
    : `http://localhost:${PORT}`;
    
  console.log(`✓ Server is running on port ${PORT}`);
  console.log(`✓ API Health: ${baseUrl}/api/health`);
  console.log(`✓ Dashboard: ${baseUrl}/api/dashboard`);
});

module.exports = app;
