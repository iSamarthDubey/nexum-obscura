const express = require('express');
const Log = require('../models/Log');
const Connection = require('../models/Connection');

const router = express.Router();

// Search logs with filters
router.get('/logs', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      sourceIP,
      destinationIP,
      protocol,
      minSuspicion,
      maxSuspicion,
      page = 1,
      limit = 100
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    if (sourceIP) filter.sourceIP = new RegExp(sourceIP, 'i');
    if (destinationIP) filter.destinationIP = new RegExp(destinationIP, 'i');
    if (protocol) filter.protocol = protocol.toUpperCase();
    
    if (minSuspicion || maxSuspicion) {
      filter.suspicionScore = {};
      if (minSuspicion) filter.suspicionScore.$gte = parseInt(minSuspicion);
      if (maxSuspicion) filter.suspicionScore.$lte = parseInt(maxSuspicion);
    }

    const skip = (page - 1) * limit;
    
    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Log.countDocuments(filter);
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search logs error:', error);
    res.status(500).json({ error: 'Failed to search logs' });
  }
});

// Search connections
router.get('/connections', async (req, res) => {
  try {
    const {
      sourceIP,
      destinationIP,
      riskLevel,
      minConnections,
      page = 1,
      limit = 50
    } = req.query;

    const filter = {};
    
    if (sourceIP) filter.sourceIP = new RegExp(sourceIP, 'i');
    if (destinationIP) filter.destinationIP = new RegExp(destinationIP, 'i');
    if (riskLevel) filter.riskLevel = riskLevel.toUpperCase();
    if (minConnections) filter.connectionCount = { $gte: parseInt(minConnections) };

    const skip = (page - 1) * limit;
    
    const connections = await Connection.find(filter)
      .sort({ avgSuspicionScore: -1, connectionCount: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Connection.countDocuments(filter);
    
    res.json({
      connections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search connections error:', error);
    res.status(500).json({ error: 'Failed to search connections' });
  }
});

// Get suspicious activities
router.get('/suspicious', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const suspiciousLogs = await Log.find({
      timestamp: { $gte: timeThreshold },
      suspicionScore: { $gte: 70 }
    })
    .sort({ suspicionScore: -1, timestamp: -1 })
    .limit(100);
    
    const suspiciousConnections = await Connection.find({
      lastSeen: { $gte: timeThreshold },
      riskLevel: { $in: ['HIGH', 'CRITICAL'] }
    })
    .sort({ avgSuspicionScore: -1 })
    .limit(50);
    
    res.json({
      logs: suspiciousLogs,
      connections: suspiciousConnections,
      timeRange: `Last ${hours} hours`
    });
  } catch (error) {
    console.error('Suspicious activities error:', error);
    res.status(500).json({ error: 'Failed to get suspicious activities' });
  }
});

module.exports = router;
