const express = require('express');
const router = express.Router();

// Generate mock IPDR data
const generateMockIPDRData = (count = 50) => {
  const data = [];
  const aParties = [
    '+91-9876543210', '+91-8765432109', '+91-7654321098', 
    '+91-9123456789', '+91-8765432100', '+1-555-0123',
    '+44-20-7123-4567', '+86-138-0013-8000'
  ];
  const bParties = [
    '+91-9111111111', '+91-8222222222', '+91-7333333333',
    '+91-9444444444', '+91-8555555555', '+1-555-9999',
    '+44-20-8888-9999', '+86-139-9999-8888'
  ];
  
  for (let i = 0; i < count; i++) {
    const aParty = aParties[Math.floor(Math.random() * aParties.length)];
    const bParty = bParties[Math.floor(Math.random() * bParties.length)];
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    data.push({
      id: `IPDR-${Date.now()}-${i}`,
      aParty,
      bParty,
      callDate: date.toISOString().split('T')[0],
      callTime: date.toTimeString().split(' ')[0],
      duration: Math.floor(Math.random() * 3600),
      callType: Math.random() > 0.7 ? 'SMS' : 'Voice',
      imei: `35${Math.floor(Math.random() * 1000000000000000)}`,
      imsi: `40401${Math.floor(Math.random() * 10000000000)}`,
      cellId: Math.floor(Math.random() * 99999),
      lac: Math.floor(Math.random() * 9999),
      suspicionScore: Math.floor(Math.random() * 100),
      riskLevel: Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low',
      timestamp: date.toISOString()
    });
  }
  
  return data;
};

// Search IPDR records with filters
router.get('/ipdr', async (req, res) => {
  try {
    const {
      aParty,
      bParty,
      startDate,
      endDate,
      minDuration,
      maxDuration,
      callType,
      minSuspicion,
      maxSuspicion,
      riskLevel,
      page = 1,
      limit = 20
    } = req.query;

    // Generate mock data
    let data = generateMockIPDRData(200);
    
    // Apply filters
    if (aParty) {
      data = data.filter(record => 
        record.aParty.toLowerCase().includes(aParty.toLowerCase())
      );
    }
    
    if (bParty) {
      data = data.filter(record => 
        record.bParty.toLowerCase().includes(bParty.toLowerCase())
      );
    }
    
    if (startDate) {
      data = data.filter(record => 
        new Date(record.callDate) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      data = data.filter(record => 
        new Date(record.callDate) <= new Date(endDate)
      );
    }
    
    if (minDuration) {
      data = data.filter(record => record.duration >= parseInt(minDuration));
    }
    
    if (maxDuration) {
      data = data.filter(record => record.duration <= parseInt(maxDuration));
    }
    
    if (callType) {
      data = data.filter(record => 
        record.callType.toLowerCase() === callType.toLowerCase()
      );
    }
    
    if (minSuspicion) {
      data = data.filter(record => record.suspicionScore >= parseInt(minSuspicion));
    }
    
    if (maxSuspicion) {
      data = data.filter(record => record.suspicionScore <= parseInt(maxSuspicion));
    }
    
    if (riskLevel) {
      data = data.filter(record => 
        record.riskLevel.toLowerCase() === riskLevel.toLowerCase()
      );
    }
    
    // Pagination
    const total = data.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = data.slice(startIndex, startIndex + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        aParty, bParty, startDate, endDate, minDuration, 
        maxDuration, callType, minSuspicion, maxSuspicion, riskLevel
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search suspicious connections
router.get('/suspicious', async (req, res) => {
  try {
    const suspiciousConnections = [
      {
        id: 'SUSP-001',
        aParty: '+91-9876543210',
        bParty: '+91-9123456789',
        frequency: 45,
        totalDuration: 8130,
        averageDuration: 181,
        firstContact: '2025-08-20T09:15:00Z',
        lastContact: '2025-08-26T14:32:00Z',
        suspicionScore: 85,
        riskLevel: 'High',
        patterns: ['Frequent Short Calls', 'Unusual Hours'],
        locations: ['Cell-1234', 'Cell-5678', 'Cell-9012']
      },
      {
        id: 'SUSP-002',
        aParty: '+91-8765432109',
        bParty: '+1-555-0123',
        frequency: 23,
        totalDuration: 6322,
        averageDuration: 275,
        firstContact: '2025-08-22T10:20:00Z',
        lastContact: '2025-08-26T13:45:00Z',
        suspicionScore: 72,
        riskLevel: 'Medium',
        patterns: ['International Calls', 'Data Usage Spike'],
        locations: ['Cell-2345', 'Cell-6789']
      },
      {
        id: 'SUSP-003',
        aParty: '+91-7654321098',
        bParty: '+91-6543210987',
        frequency: 67,
        totalDuration: 12045,
        averageDuration: 180,
        firstContact: '2025-08-18T08:30:00Z',
        lastContact: '2025-08-26T15:20:00Z',
        suspicionScore: 91,
        riskLevel: 'Critical',
        patterns: ['Burst Communication', 'Tower Hopping', 'Off-hours Activity'],
        locations: ['Cell-3456', 'Cell-7890', 'Cell-1357', 'Cell-2468']
      }
    ];
    
    res.json({
      success: true,
      data: suspiciousConnections,
      total: suspiciousConnections.length
    });
    
  } catch (error) {
    console.error('Suspicious search error:', error);
    res.status(500).json({ error: 'Failed to retrieve suspicious connections' });
  }
});

// Quick search endpoint
router.get('/quick', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    
    // Mock quick search results
    const results = {
      phoneNumbers: [
        { number: '+91-9876543210', riskScore: 85, lastSeen: '2 hours ago' },
        { number: '+91-8765432109', riskScore: 72, lastSeen: '5 hours ago' }
      ],
      locations: [
        { cellId: '1234', lac: '567', activity: 'High', suspiciousEvents: 12 },
        { cellId: '5678', lac: '890', activity: 'Medium', suspiciousEvents: 5 }
      ],
      patterns: [
        { type: 'Burst Communication', instances: 15, severity: 'High' },
        { type: 'International Routing', instances: 8, severity: 'Medium' }
      ]
    };
    
    res.json({
      success: true,
      query: q,
      results
    });
    
  } catch (error) {
    console.error('Quick search error:', error);
    res.status(500).json({ error: 'Quick search failed' });
  }
});

module.exports = router;
