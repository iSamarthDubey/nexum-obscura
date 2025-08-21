const Log = require('../models/Log');
const Connection = require('../models/Connection');

// Analyze traffic patterns
async function analyzePatterns(filter = {}) {
  try {
    // Time-based patterns
    const hourlyPattern = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 },
          avgSuspicion: { $avg: '$suspicionScore' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Protocol patterns
    const protocolPattern = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$protocol',
          count: { $sum: 1 },
          avgSuspicion: { $avg: '$suspicionScore' },
          totalBytes: { $sum: '$bytes' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Port patterns
    const portPattern = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$destinationPort',
          count: { $sum: 1 },
          avgSuspicion: { $avg: '$suspicionScore' },
          uniqueIPs: { $addToSet: '$sourceIP' }
        }
      },
      {
        $project: {
          port: '$_id',
          count: 1,
          avgSuspicion: 1,
          uniqueIPCount: { $size: '$uniqueIPs' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    // IP communication patterns
    const ipPattern = await Log.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            source: '$sourceIP',
            destination: '$destinationIP'
          },
          count: { $sum: 1 },
          avgSuspicion: { $avg: '$suspicionScore' },
          protocols: { $addToSet: '$protocol' },
          ports: { $addToSet: '$destinationPort' }
        }
      },
      {
        $project: {
          sourceIP: '$_id.source',
          destinationIP: '$_id.destination',
          count: 1,
          avgSuspicion: 1,
          protocolCount: { $size: '$protocols' },
          portCount: { $size: '$ports' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);

    return {
      hourlyPattern,
      protocolPattern,
      portPattern,
      ipPattern
    };
  } catch (error) {
    console.error('Pattern analysis error:', error);
    throw error;
  }
}

// Detect anomalies in network traffic
async function detectAnomalies(timeThreshold) {
  try {
    const anomalies = [];

    // 1. Unusual traffic volume
    const volumeAnomalies = await detectVolumeAnomalies(timeThreshold);
    anomalies.push(...volumeAnomalies);

    // 2. Port scanning detection
    const portScanAnomalies = await detectPortScanning(timeThreshold);
    anomalies.push(...portScanAnomalies);

    // 3. Unusual protocol usage
    const protocolAnomalies = await detectProtocolAnomalies(timeThreshold);
    anomalies.push(...protocolAnomalies);

    // 4. Geographic anomalies
    const geoAnomalies = await detectGeographicAnomalies(timeThreshold);
    anomalies.push(...geoAnomalies);

    // 5. Time-based anomalies
    const timeAnomalies = await detectTimeAnomalies(timeThreshold);
    anomalies.push(...timeAnomalies);

    return anomalies.sort((a, b) => b.severity_score - a.severity_score);
  } catch (error) {
    console.error('Anomaly detection error:', error);
    throw error;
  }
}

// Detect unusual traffic volume
async function detectVolumeAnomalies(timeThreshold) {
  const volumeData = await Log.aggregate([
    { $match: { timestamp: { $gte: timeThreshold } } },
    {
      $group: {
        _id: '$sourceIP',
        count: { $sum: 1 },
        totalBytes: { $sum: '$bytes' },
        avgSuspicion: { $avg: '$suspicionScore' }
      }
    },
    { $match: { count: { $gte: 1000 } } }, // High volume threshold
    { $sort: { count: -1 } }
  ]);

  return volumeData.map(data => ({
    type: 'VOLUME_ANOMALY',
    severity: data.count > 5000 ? 'CRITICAL' : data.count > 2000 ? 'HIGH' : 'MEDIUM',
    severity_score: Math.min(data.count / 100, 100),
    sourceIP: data._id,
    description: `Unusual high traffic volume: ${data.count} requests`,
    details: {
      requestCount: data.count,
      totalBytes: data.totalBytes,
      avgSuspicion: data.avgSuspicion.toFixed(2)
    }
  }));
}

// Detect port scanning activities
async function detectPortScanning(timeThreshold) {
  const portScanData = await Log.aggregate([
    { $match: { timestamp: { $gte: timeThreshold } } },
    {
      $group: {
        _id: '$sourceIP',
        uniquePorts: { $addToSet: '$destinationPort' },
        uniqueDestinations: { $addToSet: '$destinationIP' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        sourceIP: '$_id',
        portCount: { $size: '$uniquePorts' },
        destinationCount: { $size: '$uniqueDestinations' },
        totalRequests: '$count'
      }
    },
    { $match: { portCount: { $gte: 20 } } }, // Many different ports
    { $sort: { portCount: -1 } }
  ]);

  return portScanData.map(data => ({
    type: 'PORT_SCAN',
    severity: data.portCount > 100 ? 'CRITICAL' : data.portCount > 50 ? 'HIGH' : 'MEDIUM',
    severity_score: Math.min(data.portCount * 2, 100),
    sourceIP: data.sourceIP,
    description: `Potential port scanning: ${data.portCount} different ports accessed`,
    details: {
      uniquePorts: data.portCount,
      uniqueDestinations: data.destinationCount,
      totalRequests: data.totalRequests
    }
  }));
}

// Detect unusual protocol usage
async function detectProtocolAnomalies(timeThreshold) {
  const protocolData = await Log.aggregate([
    { $match: { timestamp: { $gte: timeThreshold } } },
    {
      $group: {
        _id: {
          sourceIP: '$sourceIP',
          protocol: '$protocol'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.sourceIP',
        protocols: {
          $push: {
            protocol: '$_id.protocol',
            count: '$count'
          }
        },
        totalCount: { $sum: '$count' }
      }
    },
    {
      $match: {
        $expr: { $gte: [{ $size: '$protocols' }, 4] } // Using 4+ different protocols
      }
    }
  ]);

  return protocolData.map(data => ({
    type: 'PROTOCOL_ANOMALY',
    severity: data.protocols.length > 6 ? 'HIGH' : 'MEDIUM',
    severity_score: data.protocols.length * 10,
    sourceIP: data._id,
    description: `Unusual protocol diversity: ${data.protocols.length} different protocols`,
    details: {
      protocols: data.protocols,
      totalRequests: data.totalCount
    }
  }));
}

// Detect geographic anomalies
async function detectGeographicAnomalies(timeThreshold) {
  const geoData = await Log.aggregate([
    { 
      $match: { 
        timestamp: { $gte: timeThreshold },
        'geoLocation.country': { $exists: true }
      } 
    },
    {
      $group: {
        _id: '$sourceIP',
        countries: { $addToSet: '$geoLocation.country' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        sourceIP: '$_id',
        countryCount: { $size: '$countries' },
        totalRequests: '$count'
      }
    },
    { $match: { countryCount: { $gte: 3 } } } // Multiple countries
  ]);

  return geoData.map(data => ({
    type: 'GEOGRAPHIC_ANOMALY',
    severity: data.countryCount > 5 ? 'HIGH' : 'MEDIUM',
    severity_score: data.countryCount * 15,
    sourceIP: data.sourceIP,
    description: `Traffic from multiple countries: ${data.countryCount} different locations`,
    details: {
      countryCount: data.countryCount,
      totalRequests: data.totalRequests
    }
  }));
}

// Detect time-based anomalies
async function detectTimeAnomalies(timeThreshold) {
  const timeData = await Log.aggregate([
    { $match: { timestamp: { $gte: timeThreshold } } },
    {
      $group: {
        _id: {
          sourceIP: '$sourceIP',
          hour: { $hour: '$timestamp' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.sourceIP',
        hourlyActivity: {
          $push: {
            hour: '$_id.hour',
            count: '$count'
          }
        },
        totalCount: { $sum: '$count' }
      }
    }
  ]);

  const anomalies = [];
  
  timeData.forEach(data => {
    // Check for activity during unusual hours (midnight to 6 AM)
    const nightActivity = data.hourlyActivity.filter(h => h.hour >= 0 && h.hour < 6);
    const nightCount = nightActivity.reduce((sum, h) => sum + h.count, 0);
    
    if (nightCount > data.totalCount * 0.3) { // More than 30% activity at night
      anomalies.push({
        type: 'TIME_ANOMALY',
        severity: nightCount > data.totalCount * 0.5 ? 'HIGH' : 'MEDIUM',
        severity_score: (nightCount / data.totalCount) * 100,
        sourceIP: data._id,
        description: `Unusual activity during night hours: ${nightCount} requests`,
        details: {
          nightRequests: nightCount,
          totalRequests: data.totalCount,
          nightPercentage: ((nightCount / data.totalCount) * 100).toFixed(2)
        }
      });
    }
  });

  return anomalies;
}

module.exports = {
  analyzePatterns,
  detectAnomalies,
  detectVolumeAnomalies,
  detectPortScanning,
  detectProtocolAnomalies,
  detectGeographicAnomalies,
  detectTimeAnomalies
};
