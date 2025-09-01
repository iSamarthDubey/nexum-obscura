// Comprehensive sample IPDR dataset with 500+ entries for demo showcase
// This provides realistic cybersecurity data for all visualizations

// Helper functions for generating realistic data
const getRandomIP = (type = 'internal') => {
  if (type === 'internal') {
    const subnets = ['192.168.1.', '10.0.0.', '172.16.', '192.168.0.', '10.10.10.'];
    return subnets[Math.floor(Math.random() * subnets.length)] + Math.floor(Math.random() * 255);
  } else {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }
};

const getRandomPort = () => {
  const commonPorts = [80, 443, 53, 22, 21, 23, 25, 110, 143, 993, 995, 587, 8080, 3389, 1433, 3306];
  const suspiciousPorts = [4444, 5555, 6666, 7777, 8888, 9999, 1234, 31337, 12345];
  const allPorts = [...commonPorts, ...suspiciousPorts, ...Array.from({length: 20}, () => Math.floor(Math.random() * 65535))];
  return allPorts[Math.floor(Math.random() * allPorts.length)];
};

const getRandomProtocol = () => {
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'FTP', 'SSH', 'SMTP'];
  return protocols[Math.floor(Math.random() * protocols.length)];
};

const getRandomLocation = () => {
  const locations = [
    { city: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
    { city: 'Delhi', lat: 28.7041, lng: 77.1025, country: 'India' },
    { city: 'Bangalore', lat: 12.9716, lng: 77.5946, country: 'India' },
    { city: 'Chennai', lat: 13.0827, lng: 80.2707, country: 'India' },
    { city: 'Hyderabad', lat: 17.3850, lng: 78.4867, country: 'India' },
    { city: 'Pune', lat: 18.5204, lng: 73.8567, country: 'India' },
    { city: 'Kolkata', lat: 22.5726, lng: 88.3639, country: 'India' },
    { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, country: 'India' },
    { city: 'Jaipur', lat: 26.9124, lng: 75.7873, country: 'India' },
    { city: 'Lucknow', lat: 26.8467, lng: 80.9462, country: 'India' },
    { city: 'Kanpur', lat: 26.4499, lng: 80.3319, country: 'India' },
    { city: 'Nagpur', lat: 21.1458, lng: 79.0882, country: 'India' },
    { city: 'Indore', lat: 22.7196, lng: 75.8577, country: 'India' },
    { city: 'Thane', lat: 19.2183, lng: 72.9781, country: 'India' },
    { city: 'Bhopal', lat: 23.2599, lng: 77.4126, country: 'India' },
    { city: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, country: 'India' },
    { city: 'Pimpri', lat: 18.6298, lng: 73.7997, country: 'India' },
    { city: 'Patna', lat: 25.5941, lng: 85.1376, country: 'India' },
    { city: 'Vadodara', lat: 22.3072, lng: 73.1812, country: 'India' },
    { city: 'Ludhiana', lat: 30.9010, lng: 75.8573, country: 'India' }
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

const getRandomISP = () => {
  const isps = ['Airtel', 'Jio', 'Vi', 'BSNL', 'Idea', 'Vodafone', 'MTNL', 'Tikona', 'Hathway', 'ACT Fibernet'];
  return isps[Math.floor(Math.random() * isps.length)];
};

const getRandomDeviceType = () => {
  const devices = ['Mobile', 'Desktop', 'Laptop', 'Tablet', 'Server', 'IoT Device', 'Router', 'Switch'];
  return devices[Math.floor(Math.random() * devices.length)];
};

const getRandomAnomalyType = () => {
  const anomalies = [
    'Unusual Traffic Volume', 'Suspicious Port Activity', 'Data Exfiltration Pattern',
    'Brute Force Attack', 'DDoS Pattern', 'Malware Communication', 'Unauthorized Access',
    'Geographic Anomaly', 'Protocol Abuse', 'Time-based Anomaly', 'Frequency Anomaly',
    'Port Scanning', 'SQL Injection Attempt', 'XSS Attack Pattern', 'Botnet Activity'
  ];
  return anomalies[Math.floor(Math.random() * anomalies.length)];
};

// Generate timestamp within last 7 days
const getRandomTimestamp = () => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const randomTime = new Date(weekAgo.getTime() + Math.random() * (now.getTime() - weekAgo.getTime()));
  return randomTime.toISOString();
};

// Generate 500+ IPDR log entries
const generateLogs = (count = 500) => {
  const logs = [];
  for (let i = 1; i <= count; i++) {
    const location = getRandomLocation();
    const isSuspicious = Math.random() < 0.15; // 15% suspicious activity
    const protocol = getRandomProtocol();
    const port = getRandomPort();
    
    logs.push({
      id: i,
      timestamp: getRandomTimestamp(),
      sourceIP: getRandomIP('internal'),
      destinationIP: getRandomIP('external'),
      protocol: protocol,
      port: port,
      bytes: Math.floor(Math.random() * 50000) + 256,
      duration: Math.floor(Math.random() * 3600) + 1,
      location: location.city,
      country: location.country,
      isp: getRandomISP(),
      deviceType: getRandomDeviceType(),
      suspicious: isSuspicious,
      anomalyType: isSuspicious ? getRandomAnomalyType() : null,
      riskScore: isSuspicious ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 50) + 10,
      latitude: location.lat,
      longitude: location.lng
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate network topology from logs
const generateNetworkTopology = (logs) => {
  const nodeMap = new Map();
  const edgeMap = new Map();
  
  // Create nodes from unique IPs
  logs.slice(0, 50).forEach(log => {
    // Add source node
    if (!nodeMap.has(log.sourceIP)) {
      nodeMap.set(log.sourceIP, {
        id: log.sourceIP,
        label: `${log.deviceType} (${log.location})`,
        type: log.suspicious ? 'threat' : 'client',
        location: log.location,
        connections: 0,
        riskScore: log.riskScore
      });
    }
    
    // Add destination node
    if (!nodeMap.has(log.destinationIP)) {
      nodeMap.set(log.destinationIP, {
        id: log.destinationIP,
        label: `External Server`,
        type: 'server',
        location: 'External',
        connections: 0,
        riskScore: 20
      });
    }
    
    // Create edge
    const edgeId = `${log.sourceIP}-${log.destinationIP}`;
    if (!edgeMap.has(edgeId)) {
      edgeMap.set(edgeId, {
        source: log.sourceIP,
        target: log.destinationIP,
        protocol: log.protocol,
        traffic: log.suspicious ? 'Suspicious' : (log.bytes > 10000 ? 'High' : 'Normal'),
        weight: 1
      });
    } else {
      edgeMap.get(edgeId).weight++;
    }
    
    // Update connection counts
    nodeMap.get(log.sourceIP).connections++;
    nodeMap.get(log.destinationIP).connections++;
  });
  
  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values())
  };
};

// Generate sample data
const logs = generateLogs(500);
const networkTopology = generateNetworkTopology(logs);
const suspiciousLogs = logs.filter(log => log.suspicious);

export const sampleIPDRData = {
  logs: logs,
  
  networkTopology: networkTopology,
  
  // Dashboard statistics
  stats: {
    totalConnections: logs.length,
    activeThreats: suspiciousLogs.length,
    dataProcessed: `${(logs.reduce((sum, log) => sum + log.bytes, 0) / (1024 * 1024 * 1024)).toFixed(1)} GB`,
    systemHealth: 94,
    alertsToday: suspiciousLogs.filter(log => {
      const today = new Date();
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === today.toDateString();
    }).length,
    blockedAttempts: Math.floor(suspiciousLogs.length * 0.7),
    uniqueIPs: new Set([...logs.map(l => l.sourceIP), ...logs.map(l => l.destinationIP)]).size,
    averageRiskScore: Math.floor(logs.reduce((sum, log) => sum + log.riskScore, 0) / logs.length)
  },

  // Protocol distribution from logs
  protocolDistribution: (() => {
    const protocolCounts = {};
    logs.forEach(log => {
      protocolCounts[log.protocol] = (protocolCounts[log.protocol] || 0) + 1;
    });
    
    const total = logs.length;
    const colors = ['#00d4ff', '#ff6b35', '#4ade80', '#f59e0b', '#ef4444', '#8b5cf6'];
    let colorIndex = 0;
    
    return Object.entries(protocolCounts).map(([protocol, count]) => ({
      protocol,
      name: protocol,
      count,
      percentage: ((count / total) * 100).toFixed(1),
      color: colors[colorIndex++ % colors.length]
    }));
  })(),

  // Geographic distribution from logs
  geographicData: (() => {
    const locationCounts = {};
    logs.forEach(log => {
      const key = log.location;
      if (!locationCounts[key]) {
        locationCounts[key] = {
          location: log.location,
          count: 0,
          lat: log.latitude,
          lng: log.longitude,
          suspicious: 0
        };
      }
      locationCounts[key].count++;
      if (log.suspicious) locationCounts[key].suspicious++;
    });
    
    return Object.values(locationCounts);
  })(),

  // Top source IPs from logs
  topSourceIPs: (() => {
    const ipCounts = {};
    logs.forEach(log => {
      if (!ipCounts[log.sourceIP]) {
        ipCounts[log.sourceIP] = {
          ip: log.sourceIP,
          connections: 0,
          location: log.location,
          riskScore: log.riskScore,
          suspicious: 0
        };
      }
      ipCounts[log.sourceIP].connections++;
      if (log.suspicious) ipCounts[log.sourceIP].suspicious++;
    });
    
    return Object.values(ipCounts)
      .sort((a, b) => b.connections - a.connections)
      .slice(0, 15)
      .map(ip => ({
        ...ip,
        risk: ip.riskScore > 70 ? 'High' : ip.riskScore > 40 ? 'Medium' : 'Low'
      }));
  })(),

  // Suspicious activities from logs
  suspiciousActivities: suspiciousLogs.slice(0, 20).map((log, index) => ({
    id: index + 1,
    type: log.anomalyType,
    sourceIP: log.sourceIP,
    timestamp: log.timestamp,
    severity: log.riskScore > 80 ? 'Critical' : log.riskScore > 60 ? 'High' : 'Medium',
    description: `${log.anomalyType} detected from ${log.location} (${log.deviceType})`,
    location: log.location,
    protocol: log.protocol,
    port: log.port
  })),

  // Anomaly detection data with timeline
  anomalies: (() => {
    const anomalyTypes = {};
    
    suspiciousLogs.forEach(log => {
      if (!anomalyTypes[log.anomalyType]) {
        anomalyTypes[log.anomalyType] = {
          type: log.anomalyType,
          count: 0,
          timeline: []
        };
      }
      anomalyTypes[log.anomalyType].count++;
    });
    
    // Generate timeline data for each anomaly type
    Object.values(anomalyTypes).forEach(anomaly => {
      const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      anomaly.timeline = hours.map(time => ({
        time,
        value: Math.floor(Math.random() * anomaly.count) + 1
      }));
      anomaly.description = `${anomaly.count} instances detected across multiple locations`;
    });
    
    return Object.values(anomalyTypes).slice(0, 6);
  })(),

  // Traffic flow data for time-based charts
  trafficFlow: (() => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      const hourLogs = logs.filter(log => {
        const logHour = new Date(log.timestamp).getHours();
        return logHour === i;
      });
      
      hours.push({
        time: hour,
        inbound: hourLogs.length * 50,
        outbound: hourLogs.length * 35,
        suspicious: hourLogs.filter(l => l.suspicious).length * 10,
        volume: hourLogs.reduce((sum, log) => sum + log.bytes, 0)
      });
    }
    return hours;
  })(),

  // Activity timeline from recent suspicious activities
  activityTimeline: suspiciousLogs.slice(0, 30).map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    event: `${log.anomalyType} - ${log.location}`,
    source: log.sourceIP,
    severity: log.riskScore > 80 ? 'Critical' : log.riskScore > 60 ? 'Alert' : 'Warning',
    protocol: log.protocol,
    port: log.port
  })),

  // System health metrics
  systemHealth: {
    cpu: Math.floor(Math.random() * 30) + 40,
    memory: Math.floor(Math.random() * 40) + 50,
    network: Math.floor(Math.random() * 20) + 75,
    storage: Math.floor(Math.random() * 50) + 25,
    uptime: '99.9%',
    processedToday: logs.filter(log => {
      const today = new Date();
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === today.toDateString();
    }).length,
    threatsBlocked: suspiciousLogs.length,
    averageResponseTime: '2.3ms'
  }
};

// Helper function to get formatted data for different chart types
export const getChartData = (chartType) => {
  switch (chartType) {
    case 'protocols':
      return sampleIPDRData.protocolDistribution;
    case 'geographic':
      return sampleIPDRData.geographicData;
    case 'topIPs':
      return sampleIPDRData.topSourceIPs;
    case 'suspicious':
      return sampleIPDRData.suspiciousActivities;
    case 'anomalies':
      return sampleIPDRData.anomalies;
    case 'traffic':
      return sampleIPDRData.trafficFlow;
    case 'network':
      return sampleIPDRData.networkTopology;
    case 'timeline':
      return sampleIPDRData.activityTimeline;
    case 'health':
      return sampleIPDRData.systemHealth;
    case 'stats':
      return sampleIPDRData.stats;
    case 'logs':
      return sampleIPDRData.logs;
    default:
      return sampleIPDRData;
  }
};

export default sampleIPDRData;
