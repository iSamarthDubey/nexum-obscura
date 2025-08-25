const express = require('express');
const Report = require('../models/Report');
const Log = require('../models/Log');
const Connection = require('../models/Connection');
const { generateReport } = require('../utils/reportGenerator');

const router = express.Router();

// Get all reports
router.get('/', async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (type) filter.reportType = type.toUpperCase();
    if (status) filter.status = status.toUpperCase();
    
    const skip = (page - 1) * limit;
    
    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Report.countDocuments(filter);
    
    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get specific report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Generate new report
router.post('/generate', async (req, res) => {
  try {
    const {
      title,
      description,
      reportType,
      startDate,
      endDate,
      includeRecommendations = true
    } = req.body;
    
    // Validate required fields
    if (!title || !reportType || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, reportType, startDate, endDate' 
      });
    }
    
    // Generate report data
    const reportData = await generateReport({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reportType: reportType.toUpperCase(),
      includeRecommendations
    });
    
    // Create new report
    const report = new Report({
      title,
      description: description || `${reportType} report for ${startDate} to ${endDate}`,
      reportType: reportType.toUpperCase(),
      dateRange: {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      summary: reportData.summary,
      recommendations: reportData.recommendations,
      generatedBy: 'System'
    });
    
    await report.save();
    
    res.json({
      message: 'Report generated successfully',
      report
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Generate quick incident report
router.post('/incident', async (req, res) => {
  try {
    const { sourceIP, timeRange = 24 } = req.body;
    
    if (!sourceIP) {
      return res.status(400).json({ error: 'Source IP is required' });
    }
    
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - timeRange * 60 * 60 * 1000);
    
    // Get incident data
    const incidentLogs = await Log.find({
      sourceIP,
      timestamp: { $gte: startDate, $lte: endDate },
      suspicionScore: { $gte: 50 }
    }).sort({ suspicionScore: -1, timestamp: -1 });
    
    const connections = await Connection.find({
      sourceIP,
      lastSeen: { $gte: startDate }
    });
    
    // Generate incident summary
    const summary = {
      totalLogs: incidentLogs.length,
      suspiciousActivities: incidentLogs.filter(log => log.suspicionScore >= 70).length,
      criticalThreats: incidentLogs.filter(log => log.suspicionScore >= 90).length,
      topDestinationIPs: incidentLogs.reduce((acc, log) => {
        const existing = acc.find(item => item.ip === log.destinationIP);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ 
            ip: log.destinationIP, 
            count: 1, 
            riskLevel: log.suspicionScore >= 90 ? 'CRITICAL' : 
                      log.suspicionScore >= 70 ? 'HIGH' : 'MEDIUM'
          });
        }
        return acc;
      }, []).sort((a, b) => b.count - a.count).slice(0, 10),
      protocolDistribution: incidentLogs.reduce((acc, log) => {
        const existing = acc.find(item => item.protocol === log.protocol);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ protocol: log.protocol, count: 1 });
        }
        return acc;
      }, []).map(item => ({
        ...item,
        percentage: ((item.count / incidentLogs.length) * 100).toFixed(2)
      }))
    };
    
    // Generate recommendations
    const recommendations = [];
    
    if (summary.criticalThreats > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        description: `${summary.criticalThreats} critical threats detected from ${sourceIP}`,
        action: 'Immediately block or quarantine this IP address'
      });
    }
    
    if (summary.suspiciousActivities > 10) {
      recommendations.push({
        priority: 'HIGH',
        description: `High volume of suspicious activities (${summary.suspiciousActivities})`,
        action: 'Investigate traffic patterns and consider rate limiting'
      });
    }
    
    // Create incident report
    const report = new Report({
      title: `Incident Report - ${sourceIP}`,
      description: `Security incident analysis for IP ${sourceIP} over the last ${timeRange} hours`,
      reportType: 'INCIDENT',
      dateRange: { startDate, endDate },
      summary,
      recommendations,
      generatedBy: 'System'
    });
    
    await report.save();
    
    res.json({
      message: 'Incident report generated successfully',
      report,
      incidentData: {
        logs: incidentLogs.slice(0, 50), // Limit to 50 most suspicious
        connections
      }
    });
  } catch (error) {
    console.error('Generate incident report error:', error);
    res.status(500).json({ error: 'Failed to generate incident report' });
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router;
