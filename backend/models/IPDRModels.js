const mongoose = require('mongoose');

// IPDR Log Entry Schema
const ipdrLogSchema = new mongoose.Schema({
  // Core IPDR Fields
  aParty: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  bParty: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  callTime: {
    type: Date,
    required: true,
    index: true
  },
  cellId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  
  // Analysis Fields
  suspicionScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  
  // Metadata
  sourceFile: {
    type: String,
    required: true
  },
  processedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Additional Analysis Data
  geoLocation: {
    latitude: Number,
    longitude: Number,
    location: String
  },
  
  // Investigation Flags
  flags: [{
    type: String,
    enum: ['suspicious', 'frequent_caller', 'unusual_duration', 'location_anomaly', 'pattern_match']
  }],
  
  // Associated Investigation
  investigationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investigation'
  }
}, {
  timestamps: true,
  indexes: [
    { aParty: 1, callTime: -1 },
    { bParty: 1, callTime: -1 },
    { cellId: 1, callTime: -1 },
    { riskLevel: 1, suspicionScore: -1 },
    { callTime: -1 }
  ]
});

// Investigation Schema
const investigationSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  assignedTo: {
    type: String,
    trim: true
  },
  targetNumbers: [{
    number: String,
    role: { type: String, enum: ['primary', 'secondary', 'witness'] }
  }],
  relatedLogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IPDRLog'
  }],
  findings: [{
    timestamp: { type: Date, default: Date.now },
    description: String,
    evidence: String,
    analyst: String
  }],
  timeline: [{
    timestamp: { type: Date, default: Date.now },
    event: String,
    details: String,
    user: String
  }]
}, {
  timestamps: true
});

// Alert Schema
const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Pattern Detection', 'Frequency Alert', 'Location Anomaly', 'Duration Alert', 'Network Alert'],
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  triggeredBy: {
    logId: { type: mongoose.Schema.Types.ObjectId, ref: 'IPDRLog' },
    phoneNumber: String,
    pattern: String
  },
  status: {
    type: String,
    enum: ['Active', 'Acknowledged', 'Resolved', 'False Positive'],
    default: 'Active'
  },
  acknowledgedBy: {
    user: String,
    timestamp: Date
  },
  resolvedBy: {
    user: String,
    timestamp: Date,
    resolution: String
  }
}, {
  timestamps: true,
  indexes: [
    { severity: 1, createdAt: -1 },
    { status: 1, createdAt: -1 },
    { type: 1, createdAt: -1 }
  ]
});

// Report Schema
const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Investigation Summary', 'Trend Analysis', 'Network Analysis', 'Custom Query'],
    required: true
  },
  generatedBy: {
    type: String,
    required: true
  },
  dateRange: {
    startDate: Date,
    endDate: Date
  },
  filters: {
    phoneNumbers: [String],
    cellIds: [String],
    riskLevels: [String],
    investigationIds: [String]
  },
  summary: {
    totalRecords: Number,
    highRiskEntries: Number,
    uniqueNumbers: Number,
    timeSpan: String,
    keyFindings: [String]
  },
  data: [{
    type: mongoose.Schema.Types.Mixed
  }],
  visualizations: [{
    type: String,
    config: mongoose.Schema.Types.Mixed,
    data: mongoose.Schema.Types.Mixed
  }],
  exportedFormats: [{
    format: { type: String, enum: ['PDF', 'CSV', 'JSON', 'Excel'] },
    exportedAt: Date,
    filePath: String
  }]
}, {
  timestamps: true
});

// Export models
module.exports = {
  IPDRLog: mongoose.model('IPDRLog', ipdrLogSchema),
  Investigation: mongoose.model('Investigation', investigationSchema),
  Alert: mongoose.model('Alert', alertSchema),
  Report: mongoose.model('Report', reportSchema)
};
