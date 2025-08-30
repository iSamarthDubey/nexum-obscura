const { IPDRLog, Investigation, Alert, Report } = require('../models/IPDRModels');

class DatabaseService {
  constructor() {
    this.isConnected = false;
  }

  setConnectionStatus(status) {
    this.isConnected = status;
  }

  // IPDR Log Operations
  async saveIPDRLogs(logs) {
    if (!this.isConnected) {
      console.log('⚠️ Database not connected, using in-memory storage');
      return logs;
    }

    try {
      const savedLogs = await IPDRLog.insertMany(logs, { ordered: false });
      console.log(`✅ Saved ${savedLogs.length} IPDR logs to database`);
      return savedLogs;
    } catch (error) {
      console.error('❌ Error saving IPDR logs:', error);
      throw error;
    }
  }

  async getIPDRLogs(filters = {}, limit = 100, skip = 0) {
    if (!this.isConnected) {
      return null; // Fallback to in-memory data
    }

    try {
      const query = IPDRLog.find(filters)
        .sort({ callTime: -1 })
        .limit(limit)
        .skip(skip);
      
      return await query.exec();
    } catch (error) {
      console.error('❌ Error fetching IPDR logs:', error);
      return null;
    }
  }

  async getIPDRStats() {
    if (!this.isConnected) {
      return null;
    }

    try {
      const [totalRecords, highRiskCount, uniqueAParties, uniqueBParties] = await Promise.all([
        IPDRLog.countDocuments(),
        IPDRLog.countDocuments({ riskLevel: { $in: ['High', 'Critical'] } }),
        IPDRLog.distinct('aParty').then(arr => arr.length),
        IPDRLog.distinct('bParty').then(arr => arr.length)
      ]);

      return {
        totalRecords,
        activeConnections: Math.floor(totalRecords * 0.7),
        flaggedNumbers: highRiskCount,
        investigationCases: await Investigation.countDocuments({ status: { $ne: 'Closed' } }),
        suspiciousPatterns: highRiskCount,
        networkNodes: uniqueAParties + uniqueBParties,
        dataProcessed: totalRecords,
        riskScore: highRiskCount > 0 ? Math.min(100, Math.floor((highRiskCount / totalRecords) * 100)) : 0
      };
    } catch (error) {
      console.error('❌ Error fetching IPDR stats:', error);
      return null;
    }
  }

  // Alert Operations
  async createAlert(alertData) {
    if (!this.isConnected) {
      return alertData;
    }

    try {
      const alert = new Alert({
        ...alertData,
        alertId: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
      
      return await alert.save();
    } catch (error) {
      console.error('❌ Error creating alert:', error);
      throw error;
    }
  }

  async getAlerts(filters = {}, limit = 50) {
    if (!this.isConnected) {
      return null;
    }

    try {
      return await Alert.find(filters)
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      console.error('❌ Error fetching alerts:', error);
      return null;
    }
  }

  // Investigation Operations
  async createInvestigation(investigationData) {
    if (!this.isConnected) {
      return investigationData;
    }

    try {
      const investigation = new Investigation({
        ...investigationData,
        caseId: `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
      
      return await investigation.save();
    } catch (error) {
      console.error('❌ Error creating investigation:', error);
      throw error;
    }
  }

  async getInvestigations(filters = {}) {
    if (!this.isConnected) {
      return null;
    }

    try {
      return await Investigation.find(filters)
        .sort({ createdAt: -1 })
        .populate('relatedLogs')
        .exec();
    } catch (error) {
      console.error('❌ Error fetching investigations:', error);
      return null;
    }
  }

  // Report Operations
  async createReport(reportData) {
    if (!this.isConnected) {
      return reportData;
    }

    try {
      const report = new Report({
        ...reportData,
        reportId: `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
      
      return await report.save();
    } catch (error) {
      console.error('❌ Error creating report:', error);
      throw error;
    }
  }

  async getReports(filters = {}) {
    if (!this.isConnected) {
      return null;
    }

    try {
      return await Report.find(filters)
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      return null;
    }
  }

  // Analysis Operations
  async getNetworkAnalysis(phoneNumber) {
    if (!this.isConnected) {
      return null;
    }

    try {
      const connections = await IPDRLog.find({
        $or: [
          { aParty: phoneNumber },
          { bParty: phoneNumber }
        ]
      }).limit(500);

      // Build network graph data
      const nodes = new Set();
      const edges = [];

      connections.forEach(log => {
        nodes.add(log.aParty);
        nodes.add(log.bParty);
        
        edges.push({
          source: log.aParty,
          target: log.bParty,
          duration: log.duration,
          timestamp: log.callTime,
          riskLevel: log.riskLevel,
          suspicionScore: log.suspicionScore
        });
      });

      return {
        nodes: Array.from(nodes).map(number => ({
          id: number,
          label: number,
          type: number === phoneNumber ? 'primary' : 'secondary'
        })),
        edges: edges
      };
    } catch (error) {
      console.error('❌ Error generating network analysis:', error);
      return null;
    }
  }

  // Pattern Detection
  async detectPatterns() {
    if (!this.isConnected) {
      return null;
    }

    try {
      // Frequent callers
      const frequentCallers = await IPDRLog.aggregate([
        {
          $group: {
            _id: '$aParty',
            callCount: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            avgSuspicionScore: { $avg: '$suspicionScore' }
          }
        },
        {
          $match: { callCount: { $gte: 5 } }
        },
        {
          $sort: { callCount: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Suspicious patterns
      const suspiciousPatterns = await IPDRLog.find({
        suspicionScore: { $gte: 70 }
      }).limit(20);

      return {
        frequentCallers,
        suspiciousPatterns,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error detecting patterns:', error);
      return null;
    }
  }
}

module.exports = new DatabaseService();
