const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    required: true,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'INCIDENT', 'CUSTOM']
  },
  dateRange: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  summary: {
    totalLogs: Number,
    suspiciousActivities: Number,
    criticalThreats: Number,
    topSourceIPs: [{
      ip: String,
      count: Number,
      riskLevel: String
    }],
    topDestinationIPs: [{
      ip: String,
      count: Number,
      riskLevel: String
    }],
    protocolDistribution: [{
      protocol: String,
      count: Number,
      percentage: Number
    }]
  },
  recommendations: [{
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    },
    description: String,
    action: String
  }],
  generatedBy: {
    type: String,
    default: 'System'
  },
  status: {
    type: String,
    enum: ['DRAFT', 'COMPLETED', 'ARCHIVED'],
    default: 'COMPLETED'
  }
}, {
  timestamps: true
});

reportSchema.index({ reportType: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
