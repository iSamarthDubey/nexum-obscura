const moment = require('moment');

// Parse a log entry from CSV data
function parseLogEntry(csvRow) {
  // Map CSV columns to log fields
  // Adjust column names based on your actual CSV format
  const logEntry = {
    timestamp: new Date(csvRow.timestamp || csvRow.time || csvRow.date),
    sourceIP: csvRow.source_ip || csvRow.src_ip || csvRow.sourceIP,
    destinationIP: csvRow.dest_ip || csvRow.dst_ip || csvRow.destinationIP,
    sourcePort: parseInt(csvRow.source_port || csvRow.src_port || csvRow.sourcePort) || 0,
    destinationPort: parseInt(csvRow.dest_port || csvRow.dst_port || csvRow.destinationPort) || 0,
    protocol: (csvRow.protocol || 'TCP').toUpperCase(),
    action: (csvRow.action || 'ALLOW').toUpperCase(),
    bytes: parseInt(csvRow.bytes || csvRow.size || 0),
    packets: parseInt(csvRow.packets || csvRow.count || 1),
    flags: []
  };

  // Validate required fields
  if (!logEntry.sourceIP || !logEntry.destinationIP) {
    throw new Error('Missing required IP addresses');
  }

  // Add geo-location if available
  if (csvRow.country || csvRow.city) {
    logEntry.geoLocation = {
      country: csvRow.country,
      city: csvRow.city,
      latitude: parseFloat(csvRow.latitude) || null,
      longitude: parseFloat(csvRow.longitude) || null
    };
  }

  return logEntry;
}

// Calculate suspicion score based on various factors
function calculateSuspicionScore(logEntry) {
  let score = 0;
  const flags = [];

  // Check for suspicious ports
  const suspiciousPorts = [23, 135, 139, 445, 1433, 3389, 5900, 6000];
  if (suspiciousPorts.includes(logEntry.destinationPort)) {
    score += 25;
    flags.push('SUSPICIOUS_PORT');
  }

  // Check for unusual hours (outside 6 AM - 10 PM)
  const hour = new Date(logEntry.timestamp).getHours();
  if (hour < 6 || hour > 22) {
    score += 15;
    flags.push('UNUSUAL_TIME');
  }

  // Check for large data transfers
  if (logEntry.bytes > 100 * 1024 * 1024) { // > 100MB
    score += 20;
    flags.push('LARGE_TRANSFER');
  }

  // Check for blocked/denied actions
  if (logEntry.action === 'DENY' || logEntry.action === 'BLOCK' || logEntry.action === 'DROP') {
    score += 30;
  }

  // Check for known suspicious protocols on unusual ports
  if (logEntry.protocol === 'TCP' && logEntry.destinationPort < 1024 && logEntry.destinationPort !== 80 && logEntry.destinationPort !== 443) {
    score += 10;
  }

  // Check for private IP ranges attempting external connections
  if (isPrivateIP(logEntry.sourceIP) && !isPrivateIP(logEntry.destinationIP)) {
    // This could be normal, but worth noting
    score += 5;
  }

  // Check for high packet count with low bytes (potential DoS)
  if (logEntry.packets > 1000 && logEntry.bytes < 10000) {
    score += 25;
    flags.push('HIGH_FREQUENCY');
  }

  // Add flags to log entry
  logEntry.flags = flags;

  // Cap score at 100
  return Math.min(score, 100);
}

// Check if IP is in private range
function isPrivateIP(ip) {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./
  ];
  
  return privateRanges.some(range => range.test(ip));
}

// Parse time range string to Date objects
function parseTimeRange(timeRange) {
  const now = new Date();
  
  switch (timeRange) {
    case '1h':
      return { start: new Date(now.getTime() - 60 * 60 * 1000), end: now };
    case '6h':
      return { start: new Date(now.getTime() - 6 * 60 * 60 * 1000), end: now };
    case '24h':
      return { start: new Date(now.getTime() - 24 * 60 * 60 * 1000), end: now };
    case '7d':
      return { start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
    case '30d':
      return { start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
    default:
      return { start: new Date(now.getTime() - 24 * 60 * 60 * 1000), end: now };
  }
}

// Validate IP address format
function isValidIP(ip) {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;
  
  return ip.split('.').every(octet => {
    const num = parseInt(octet);
    return num >= 0 && num <= 255;
  });
}

// Extract domain from URL if present
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

module.exports = {
  parseLogEntry,
  calculateSuspicionScore,
  isPrivateIP,
  parseTimeRange,
  isValidIP,
  extractDomain
};
