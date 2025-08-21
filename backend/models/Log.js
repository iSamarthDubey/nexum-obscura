const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  sourceIP: {
    type: String,
    required: true,
    index: true
  },
  destinationIP: {
    type: String,
    required: true,
    index: true
  },
  sourcePort: {
    type: Number,
    required: true
  },
  destinationPort: {
    type: Number,
    required: true
  },
  protocol: {
    type: String,
    required: true,
    enum: ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'FTP', 'SSH']
  },
  action: {
    type: String,
    required: true,
    enum: ['ALLOW', 'DENY', 'DROP', 'BLOCK']
  },
  bytes: {
    type: Number,
    default: 0
  },
  packets: {
    type: Number,
    default: 0
  },
  suspicionScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  flags: [{
    type: String,
    enum: ['SUSPICIOUS_PORT', 'HIGH_FREQUENCY', 'UNUSUAL_TIME', 'BLACKLISTED_IP', 'LARGE_TRANSFER']
  }],
  geoLocation: {
    country: String,
    city: String,
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

// Indexes for performance
logSchema.index({ timestamp: 1, suspicionScore: -1 });
logSchema.index({ sourceIP: 1, destinationIP: 1 });

module.exports = mongoose.model('Log', logSchema);
