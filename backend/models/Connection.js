const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  sourceIP: {
    type: String,
    required: true
  },
  destinationIP: {
    type: String,
    required: true
  },
  connectionCount: {
    type: Number,
    default: 1
  },
  firstSeen: {
    type: Date,
    required: true
  },
  lastSeen: {
    type: Date,
    required: true
  },
  totalBytes: {
    type: Number,
    default: 0
  },
  totalPackets: {
    type: Number,
    default: 0
  },
  avgSuspicionScore: {
    type: Number,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  commonPorts: [{
    port: Number,
    frequency: Number
  }],
  protocols: [{
    protocol: String,
    count: Number
  }]
}, {
  timestamps: true
});

connectionSchema.index({ sourceIP: 1, destinationIP: 1 }, { unique: true });
connectionSchema.index({ riskLevel: 1, avgSuspicionScore: -1 });

module.exports = mongoose.model('Connection', connectionSchema);
