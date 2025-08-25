const express = require('express');
const Log = require('../models/Log');
const Connection = require('../models/Connection');
const { analyzePatterns, detectAnomalies } = require('../utils/analyzer');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    // Basic statistics
    const totalLogs = await Log.countDocuments({ timestamp: { $gte: timeThreshold } });
    const suspiciousLogs = await Log.countDocuments({ 
      timestamp: { $gte: timeThreshold },
      suspicionScore: { $gte: 70 }
    });
    const criticalLogs = await Log.countDocuments({ 
      timestamp: { $gte: timeThreshold },
      suspicionScore: { $gte: 90 }
    });
    
    // Protocol distribution
    const protocolStats = await Log.aggregate([
      { $match: { timestamp: { $gte: timeThreshold } } },
      { $group: { _id: '$protocol', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Top source IPs by suspicion
    const topSuspiciousIPs = await Log.aggregate([
      { $match: { timestamp: { $gte: timeThreshold }, suspicionScore: { $gte: 50 } } },
      { 
        $group: { 
          _id: '$sourceIP', 
          count: { $sum: 1 },
          avgSuspicion: { $avg: '$suspicionScore' },
          maxSuspicion: { $max: '$suspicionScore' }
        } 
      },
      { $sort: { avgSuspicion: -1, count: -1 } },
      { $limit: 10 }
    ]);
    
    // Activity timeline (hourly)
    const timeline = await Log.aggregate([
      { $match: { timestamp: { $gte: timeThreshold } } },
      {
        $group: {
          _id: {
            hour: { $hour: '$timestamp' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          total: { $sum: 1 },
          suspicious: { 
            $sum: { $cond: [{ $gte: ['$suspicionScore', 70] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.date': 1, '_id.hour': 1 } }
    ]);
    
    res.json({
      overview: {
        totalLogs,
        suspiciousLogs,
        criticalLogs,
        suspiciousPercentage: totalLogs > 0 ? ((suspiciousLogs / totalLogs) * 100).toFixed(2) : 0
      },
      protocolDistribution: protocolStats,
      topSuspiciousIPs,
      timeline,
      timeRange: `Last ${hours} hours`
    });
  } catch (error) {
    console.error('Dashboard analysis error:', error);
    res.status(500).json({ error: 'Failed to generate dashboard data' });
  }
});

// Analyze traffic patterns
router.get('/patterns', async (req, res) => {
  try {
    const { sourceIP, hours = 24 } = req.query;
    const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    let filter = { timestamp: { $gte: timeThreshold } };
    if (sourceIP) filter.sourceIP = sourceIP;
    
    const patterns = await analyzePatterns(filter);
    
    res.json({
      patterns,
      analysis: {
        timeRange: `Last ${hours} hours`,
        sourceIP: sourceIP || 'All IPs'
      }
    });
  } catch (error) {
    console.error('Pattern analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze patterns' });
  }
});

// Detect anomalies
router.get('/anomalies', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const anomalies = await detectAnomalies(timeThreshold);
    
    res.json({
      anomalies,
      summary: {
        total: anomalies.length,
        critical: anomalies.filter(a => a.severity === 'CRITICAL').length,
        high: anomalies.filter(a => a.severity === 'HIGH').length,
        medium: anomalies.filter(a => a.severity === 'MEDIUM').length
      },
      timeRange: `Last ${hours} hours`
    });
  } catch (error) {
    console.error('Anomaly detection error:', error);
    res.status(500).json({ error: 'Failed to detect anomalies' });
  }
});

// Get network topology data
router.get('/topology', async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    
    const connections = await Connection.find()
      .sort({ connectionCount: -1, avgSuspicionScore: -1 })
      .limit(parseInt(limit));
    
    // Transform for network visualization
    const nodes = new Set();
    const links = [];
    
    connections.forEach(conn => {
      nodes.add(conn.sourceIP);
      nodes.add(conn.destinationIP);
      
      links.push({
        source: conn.sourceIP,
        target: conn.destinationIP,
        weight: conn.connectionCount,
        suspicion: conn.avgSuspicionScore,
        riskLevel: conn.riskLevel
      });
    });
    
    res.json({
      nodes: Array.from(nodes).map(ip => ({
        id: ip,
        label: ip,
        // Add node properties based on IP analysis
      })),
      links,
      metadata: {
        totalNodes: nodes.size,
        totalConnections: connections.length
      }
    });
  } catch (error) {
    console.error('Topology analysis error:', error);
    res.status(500).json({ error: 'Failed to generate topology data' });
  }
});

module.exports = router;
