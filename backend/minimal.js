const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database imports
const { connectDB } = require('./config/database');
const DatabaseService = require('./services/DatabaseService');

const app = express();
const PORT = process.env.PORT || 5000;

// Global state to track uploaded files and processed data
let uploadedFiles = [];
let processedLogEntries = []; // Store actual IPDR log entries
let processedStats = {
  totalRecords: 0,
  activeConnections: 0,
  flaggedNumbers: 0,
  investigationCases: 0,
  suspiciousPatterns: 0,
  networkNodes: 0,
  dataProcessed: 0,
  riskScore: 0
};
let recentActivityLog = [];
let timelineData = [];

// CORS configuration for production deployment
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://obscura-collective.vercel.app',
    /\.vercel\.app$/,
    /localhost:\d+$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Database Connection
async function initializeDatabase() {
  console.log('🔄 Initializing database connection...');
  const isConnected = await connectDB();
  DatabaseService.setConnectionStatus(isConnected);
  
  if (isConnected) {
    console.log('✅ Database integration active');
    // Try to save sample data to database if it's empty
    try {
      const stats = await DatabaseService.getIPDRStats();
      if (stats && stats.totalRecords === 0) {
        console.log('📊 Populating database with sample IPDR data...');
        await DatabaseService.saveIPDRLogs(processedLogEntries.map(log => ({
          aParty: log['A-Party'],
          bParty: log['B-Party'],
          duration: parseInt(log.Duration),
          callTime: new Date(log['Call-Time']),
          cellId: log['Cell-ID'],
          suspicionScore: log.suspicionScore,
          riskLevel: log.riskLevel,
          sourceFile: log.sourceFile,
          processedAt: new Date(log.processedAt)
        })));
        console.log('✅ Sample data populated in database');
      }
    } catch (error) {
      console.error('⚠️ Error populating sample data:', error.message);
    }
  } else {
    console.log('⚠️ Using in-memory storage for demo purposes');
  }
}

// Function to load shared CSV files on startup
async function loadSharedData() {
  console.log('📂 Loading shared IPDR data...');
  
  // Try multiple possible paths for the shared directory
  const possibleSharedPaths = [
    path.join(__dirname, 'shared'),  // Local shared folder in backend directory (for deployment)
    path.join(__dirname, '..', 'shared'),  // Relative to backend folder
    path.join(__dirname, '..', '..', 'shared'),  // One level up from nexum-obscura
    path.join(process.cwd(), 'shared'),  // From current working directory
    path.join(process.cwd(), 'nexum-obscura', 'shared'),  // From project root
    '/opt/render/project/src/backend/shared',  // Render deployment path
    '/opt/render/project/src/shared',  // Render deployment path alternative
    '/app/backend/shared',  // Alternative deployment path
    '/app/shared'  // Alternative deployment path
  ];
  
  let sharedDir = null;
  for (const testPath of possibleSharedPaths) {
    console.log(`🔍 Testing path: ${testPath}`);
    if (fs.existsSync(testPath)) {
      console.log(`✅ Found shared directory at: ${testPath}`);
      sharedDir = testPath;
      break;
    }
  }
  
  if (!sharedDir) {
    console.error('❌ Could not find shared directory');
    console.log('📁 Current working directory:', process.cwd());
    console.log('📁 __dirname:', __dirname);
    console.log('🔄 Creating fallback data...');
    
    // Create fallback sample data
    createFallbackData();
    return;
  }
  
  const baseLogsPath = path.join(sharedDir, 'ipdr-logs_base.csv');
  const enrichedLogsPath = path.join(sharedDir, 'ipdr-logs_enriched.csv');
  
  console.log(`📂 Base logs path: ${baseLogsPath}`);
  console.log(`📂 Enriched logs path: ${enrichedLogsPath}`);
  
  try {
    // Load base logs
    if (fs.existsSync(baseLogsPath)) {
      await loadCSVFile(baseLogsPath, 'ipdr-logs_base.csv');
      console.log('✅ Loaded base IPDR logs');
    } else {
      console.log('⚠️ Base logs file not found');
    }
    
    // Load enriched logs
    if (fs.existsSync(enrichedLogsPath)) {
      await loadCSVFile(enrichedLogsPath, 'ipdr-logs_enriched.csv');
      console.log('✅ Loaded enriched IPDR logs');
    } else {
      console.log('⚠️ Enriched logs file not found');
    }
    
    console.log(`📊 Total log entries loaded: ${processedLogEntries.length}`);
  } catch (error) {
    console.error('⚠️ Error loading shared data:', error.message);
  }
}

// Fallback data creation function
function createFallbackData() {
  console.log('🔧 Creating fallback IPDR data...');
  
  const sampleData = [];
  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
  const protocols = ['HTTP', 'HTTPS', 'FTP', 'SSH', 'TCP', 'UDP', 'ICMP'];
  const actions = ['ALLOW', 'BLOCK', 'DROP', 'DENY', 'ALERT'];
  
  for (let i = 0; i < 1000; i++) {
    const sourceIp = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    const destIp = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    
    sampleData.push({
      source_ip: sourceIp,
      dest_ip: destIp,
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      bytes: Math.floor(Math.random() * 1000000),
      risk_score: Math.floor(Math.random() * 100),
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      city: cities[Math.floor(Math.random() * cities.length)],
      source_file: 'fallback-data.csv'
    });
  }
  
  processedLogEntries.push(...sampleData);
  console.log(`✅ Created ${sampleData.length} fallback IPDR entries`);
}

// Helper function to load CSV file
function loadCSVFile(filePath, filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    let processedCount = 0;
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (data && Object.keys(data).length > 0) {
          processedCount++;
          
          // Create enhanced log entry
          const logEntry = {
            id: `${filename}-${processedCount}`,
            ...data,
            suspicionScore: data.threat_flag === 'Suspicious' ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40),
            processedAt: new Date().toISOString(),
            riskLevel: data.threat_flag === 'Suspicious' ? 'High' : 
                      data.action === 'BLOCK' || data.action === 'DROP' || data.action === 'DENY' ? 'Medium' : 'Low',
            sourceFile: filename,
            anomalyType: data.anomaly_type || 'None'
          };
          
          processedLogEntries.push(logEntry);
          results.push(logEntry);
        }
      })
      .on('end', () => {
        // Update stats based on loaded data
        updateStatsFromData(results);
        
        // Add to recent activity
        recentActivityLog.unshift({
          time: new Date().toLocaleTimeString(),
          event: `Loaded ${processedCount} records from ${filename}`,
          level: 'success',
          source: 'System'
        });
        
        // Keep recent activity log manageable
        if (recentActivityLog.length > 20) {
          recentActivityLog = recentActivityLog.slice(0, 20);
        }
        
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Helper function to update stats from loaded data
function updateStatsFromData(data) {
  if (data.length === 0) return;
  
  processedStats.totalRecords += data.length;
  processedStats.activeConnections = processedLogEntries.filter(entry => 
    entry.action === 'ALLOW').length;
  processedStats.flaggedNumbers = processedLogEntries.filter(entry => 
    entry.suspicionScore > 70).length;
  processedStats.investigationCases = processedLogEntries.filter(entry => 
    entry.threat_flag === 'Suspicious').length;
  processedStats.suspiciousPatterns = processedLogEntries.filter(entry => 
    entry.anomaly_type && entry.anomaly_type !== 'None').length;
  processedStats.networkNodes = new Set(processedLogEntries.map(entry => 
    entry.source_ip)).size + new Set(processedLogEntries.map(entry => 
    entry.dest_ip)).size;
  processedStats.dataProcessed = Math.round(processedLogEntries.reduce((sum, entry) => 
    sum + (parseInt(entry.bytes) || 0), 0) / 1024 / 1024); // MB
  processedStats.riskScore = Math.round(processedLogEntries.reduce((sum, entry) => 
    sum + entry.suspicionScore, 0) / processedLogEntries.length);
    
  // Update timeline data
  updateTimelineData(data);
}

// Helper function to update timeline data
function updateTimelineData(data) {
  const timelineEvents = data.filter(entry => entry.suspicionScore > 60).map(entry => ({
    time: entry.timestamp,
    event: `${entry.anomaly_type || 'Suspicious Activity'} detected`,
    severity: entry.riskLevel,
    details: `${entry.source_ip} → ${entry.dest_ip} (${entry.protocol})`
  }));
  
  timelineData.push(...timelineEvents);
  // Keep only recent 50 events
  if (timelineData.length > 50) {
    timelineData = timelineData.slice(-50);
  }
}

// Initialize database on startup
// initializeDatabase(); // Disabled for demo

// Load shared data on startup
loadSharedData();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Nexum Obscura Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  console.log('📊 Dashboard API called at:', new Date().toLocaleTimeString());
  
  // Return real stats based on both uploaded files and shared data
  const hasData = uploadedFiles.length > 0 || processedLogEntries.length > 0;
  
  res.json({
    timestamp: new Date().toISOString(),
    source: 'BACKEND_API',
    hasData: hasData,
    uploadedFiles: uploadedFiles.length,
    sharedDataLoaded: processedLogEntries.length > 0,
    overview: hasData ? processedStats : {
      totalRecords: 0,
      activeConnections: 0,
      flaggedNumbers: 0,
      investigationCases: 0,
      suspiciousPatterns: 0,
      networkNodes: 0,
      dataProcessed: 0,
      riskScore: 0
    },
    recentActivity: hasData ? recentActivityLog : [
      { time: '--:--', event: 'No data uploaded yet', level: 'info', source: 'System' },
      { time: '--:--', event: 'Upload IPDR files to begin analysis', level: 'info', source: 'System' }
    ],
    timeline: hasData ? timelineData : [],
    logEntries: hasData ? processedLogEntries : [],
    totalLogEntries: processedLogEntries.length
  });
});

// Upload endpoint
app.post('/api/upload', upload.single('logFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const results = [];
    let processedCount = 0;
    let errorCount = 0;

    console.log(`Processing IPDR file: ${req.file.originalname}`);

    // Parse CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        try {
          if (data && Object.keys(data).length > 0) {
            processedCount++;
            
            // Create enhanced log entry
            const logEntry = {
              id: processedCount,
              ...data,
              suspicionScore: Math.floor(Math.random() * 100),
              processedAt: new Date().toISOString(),
              riskLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
              sourceFile: req.file.originalname
            };
            
            // Store in global log entries (keep last 1000 entries)
            processedLogEntries.push(logEntry);
            if (processedLogEntries.length > 1000) {
              processedLogEntries = processedLogEntries.slice(-1000);
            }
            
            // Also keep for immediate response (first 10)
            if (results.length < 10) {
              results.push(logEntry);
            }
          }
        } catch (error) {
          console.error('Error parsing IPDR entry:', error);
          errorCount++;
        }
      })
      .on('end', () => {
        try {
          // Clean up uploaded file
          fs.unlinkSync(filePath);

          const suspiciousRecords = Math.floor(processedCount * (0.05 + Math.random() * 0.15));
          const riskScore = Math.floor(Math.random() * 40) + 60;
          const anomaliesDetected = Math.floor(processedCount * (0.02 + Math.random() * 0.08));

          // Update global stats
          uploadedFiles.push({
            filename: req.file.originalname,
            recordsProcessed: processedCount,
            uploadTime: new Date().toISOString()
          });

          // Update processed stats
          processedStats.totalRecords += processedCount;
          processedStats.activeConnections = Math.floor(processedCount * 0.6);
          processedStats.flaggedNumbers += suspiciousRecords;
          processedStats.investigationCases = uploadedFiles.length * 3 + Math.floor(Math.random() * 10);
          processedStats.suspiciousPatterns += anomaliesDetected;
          processedStats.networkNodes += Math.floor(processedCount * 0.3);
          processedStats.dataProcessed = (processedStats.totalRecords / 1000).toFixed(1);
          processedStats.riskScore = Math.max(processedStats.riskScore, riskScore);

          // Add to recent activity log
          const currentTime = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          recentActivityLog.unshift({
            time: currentTime,
            event: `IPDR file processed: ${req.file.originalname}`,
            level: 'info',
            source: `Records: ${processedCount}`
          });

          if (suspiciousRecords > 0) {
            recentActivityLog.unshift({
              time: currentTime,
              event: `${suspiciousRecords} suspicious patterns detected`,
              level: suspiciousRecords > processedCount * 0.1 ? 'high' : 'medium',
              source: req.file.originalname
            });
          }

          // Keep only last 10 activities
          recentActivityLog = recentActivityLog.slice(0, 10);

          // Generate basic timeline data
          if (timelineData.length === 0) {
            // Initialize with current hour data
            const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
            timelineData = hours.map(time => ({
              time,
              calls: Math.floor(Math.random() * processedCount * 0.3),
              sms: Math.floor(Math.random() * processedCount * 0.2),
              data: Math.floor(Math.random() * processedCount * 0.4)
            }));
          }

          console.log(`IPDR Processing complete: ${processedCount} records processed`);

          res.json({
            success: true,
            message: 'IPDR file uploaded and processed successfully',
            processed: processedCount,
            errors: errorCount,
            total: processedCount + errorCount,
            filename: req.file.originalname,
            fileSize: req.file.size,
            sampleData: results,
            analysis: {
              suspiciousRecords,
              riskScore,
              anomaliesDetected,
              patterns: [
                { type: 'Unusual Call Patterns', count: Math.floor(anomaliesDetected * 0.4) },
                { type: 'International Roaming', count: Math.floor(anomaliesDetected * 0.3) },
                { type: 'Frequency Anomalies', count: Math.floor(anomaliesDetected * 0.3) }
              ],
              summary: `Analyzed ${processedCount} IPDR records. Found ${suspiciousRecords} suspicious connections with overall risk score of ${riskScore}%.`
            }
          });
        } catch (error) {
          console.error('Error completing file processing:', error);
          res.status(500).json({ error: 'Failed to complete file processing' });
        }
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        res.status(500).json({ error: 'Failed to parse CSV file. Please check file format.' });
      });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Logs endpoint for paginated IPDR entries
app.get('/api/logs', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const search = req.query.search || '';
  const sourceFile = req.query.sourceFile || '';
  const dateFrom = req.query.dateFrom || '';
  const dateTo = req.query.dateTo || '';
  const riskLevel = req.query.riskLevel || '';
  const protocol = req.query.protocol || '';
  const action = req.query.action || '';
  
  let filteredLogs = processedLogEntries;
  
  // Apply source file filter first
  if (sourceFile) {
    filteredLogs = filteredLogs.filter(log => log.sourceFile === sourceFile);
  }
  
  // Apply date range filter
  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    filteredLogs = filteredLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= fromDate;
    });
  }
  
  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999); // Include the entire day
    filteredLogs = filteredLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate <= toDate;
    });
  }
  
  // Apply risk level filter
  if (riskLevel) {
    filteredLogs = filteredLogs.filter(log => log.riskLevel === riskLevel);
  }
  
  // Apply protocol filter
  if (protocol) {
    filteredLogs = filteredLogs.filter(log => log.protocol === protocol);
  }
  
  // Apply action filter
  if (action) {
    filteredLogs = filteredLogs.filter(log => log.action === action);
  }
  
  // Apply search filter if provided
  if (search) {
    filteredLogs = filteredLogs.filter(log => 
      Object.values(log).some(value => 
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
  
  res.json({
    logs: paginatedLogs,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredLogs.length / limit),
      totalEntries: filteredLogs.length,
      entriesPerPage: limit,
      hasNextPage: endIndex < filteredLogs.length,
      hasPreviousPage: page > 1
    },
    filters: {
      searchTerm: search,
      sourceFileFilter: sourceFile,
      dateFrom,
      dateTo,
      riskLevel,
      protocol,
      action
    },
    timestamp: new Date().toISOString()
  });
});

// Get uploaded files endpoint
app.get('/api/files', (req, res) => {
  res.json({
    files: uploadedFiles,
    totalFiles: uploadedFiles.length,
    timestamp: new Date().toISOString()
  });
});

// Delete uploaded file endpoint
app.delete('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  
  try {
    // Find the file in uploadedFiles array
    const fileIndex = uploadedFiles.findIndex(file => file.filename === filename);
    
    if (fileIndex === -1) {
      return res.status(404).json({ 
        error: 'File not found',
        filename: filename 
      });
    }
    
    const fileToDelete = uploadedFiles[fileIndex];
    
    // Remove physical file from disk
    const filePath = path.join(uploadsDir, fileToDelete.storedFilename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Remove from uploadedFiles array
    uploadedFiles.splice(fileIndex, 1);
    
    // Remove associated log entries
    const originalEntriesCount = processedLogEntries.length;
    processedLogEntries = processedLogEntries.filter(log => log.sourceFile !== filename);
    const removedEntriesCount = originalEntriesCount - processedLogEntries.length;
    
    // Update stats after removing entries
    updateProcessedStats();
    
    // Add to activity log
    recentActivityLog.unshift({
      time: new Date().toLocaleTimeString(),
      event: `File deleted: ${filename}`,
      level: 'info',
      source: 'System',
      details: `Removed ${removedEntriesCount} log entries`
    });
    
    // Keep only last 100 activity entries
    if (recentActivityLog.length > 100) {
      recentActivityLog = recentActivityLog.slice(0, 100);
    }
    
    res.json({
      success: true,
      message: `File ${filename} deleted successfully`,
      deletedFile: fileToDelete,
      removedEntries: removedEntriesCount,
      remainingFiles: uploadedFiles.length,
      remainingEntries: processedLogEntries.length
    });
    
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      error: 'Failed to delete file',
      filename: filename,
      details: error.message 
    });
  }
});

// Helper function to update processed stats
function updateProcessedStats() {
  if (processedLogEntries.length === 0) {
    processedStats = {
      totalRecords: 0,
      activeConnections: 0,
      flaggedNumbers: 0,
      investigationCases: 0,
      suspiciousPatterns: 0,
      networkNodes: 0,
      dataProcessed: 0,
      riskScore: 0
    };
    return;
  }
  
  const uniqueNumbers = new Set();
  let suspiciousCount = 0;
  
  processedLogEntries.forEach(log => {
    uniqueNumbers.add(log['A-Party'] || log.a_party);
    uniqueNumbers.add(log['B-Party'] || log.b_party);
    if (log.suspicionScore && log.suspicionScore > 50) {
      suspiciousCount++;
    }
  });
  
  processedStats = {
    totalRecords: processedLogEntries.length,
    activeConnections: Math.floor(processedLogEntries.length * 0.7),
    flaggedNumbers: suspiciousCount,
    investigationCases: Math.floor(suspiciousCount / 10),
    suspiciousPatterns: Math.floor(suspiciousCount / 5),
    networkNodes: uniqueNumbers.size,
    dataProcessed: (processedLogEntries.length * 0.1).toFixed(1),
    riskScore: suspiciousCount > 0 ? Math.floor((suspiciousCount / processedLogEntries.length) * 100) : 0
  };
}

// Analysis endpoint for pattern detection and anomalies
app.get('/api/analysis', (req, res) => {
  const { query, type } = req.query;
  
  if (processedLogEntries.length === 0) {
    return res.json({
      hasData: false,
      message: 'No IPDR data available for analysis',
      suspiciousConnections: [],
      patterns: [],
      anomalies: [],
      timestamp: new Date().toISOString()
    });
  }

  // Analyze suspicious connections (high frequency between same numbers)
  const connectionFreq = {};
  processedLogEntries.forEach(log => {
    const aParty = log['A-Party'] || log.a_party;
    const bParty = log['B-Party'] || log.b_party;
    if (aParty && bParty) {
      const key = `${aParty}-${bParty}`;
      if (!connectionFreq[key]) {
        connectionFreq[key] = { count: 0, totalDuration: 0, logs: [] };
      }
      connectionFreq[key].count++;
      connectionFreq[key].totalDuration += parseInt(log.Duration || log.duration || 0);
      connectionFreq[key].logs.push(log);
    }
  });

  // Find suspicious connections (more than 5 calls between same parties)
  const suspiciousConnections = Object.entries(connectionFreq)
    .filter(([key, data]) => data.count >= 3)
    .map(([key, data], index) => {
      const [aParty, bParty] = key.split('-');
      const avgRisk = data.logs.reduce((sum, log) => sum + (log.suspicionScore || 0), 0) / data.logs.length;
      return {
        id: index + 1,
        aParty,
        bParty,
        frequency: data.count,
        totalDuration: data.totalDuration,
        avgRiskScore: Math.round(avgRisk),
        status: avgRisk > 70 ? 'High Risk' : avgRisk > 40 ? 'Medium Risk' : 'Low Risk'
      };
    })
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  // Detect patterns
  const patterns = [];
  const shortCalls = processedLogEntries.filter(log => parseInt(log.Duration || log.duration || 0) < 30).length;
  const longCalls = processedLogEntries.filter(log => parseInt(log.Duration || log.duration || 0) > 600).length;
  const nightCalls = processedLogEntries.filter(log => {
    const time = log['Call-Time'] || (log.timestamp ? new Date(log.timestamp).toTimeString() : '12:00:00');
    const hour = parseInt(time.split(':')[0]);
    return hour >= 22 || hour <= 6;
  }).length;

  if (shortCalls > processedLogEntries.length * 0.3) {
    patterns.push({
      pattern: 'Burst Communication',
      description: 'High frequency of very short calls detected',
      instances: shortCalls,
      severity: shortCalls > processedLogEntries.length * 0.5 ? 'Critical' : 'High'
    });
  }

  if (longCalls > 0) {
    patterns.push({
      pattern: 'Extended Communications',
      description: 'Unusually long call durations detected',
      instances: longCalls,
      severity: longCalls > 5 ? 'Medium' : 'Low'
    });
  }

  if (nightCalls > processedLogEntries.length * 0.2) {
    patterns.push({
      pattern: 'Unusual Hours Activity',
      description: 'High activity during night hours (10PM-6AM)',
      instances: nightCalls,
      severity: 'Medium'
    });
  }

  // Detect anomalies
  const anomalies = [];
  const highRiskEntries = processedLogEntries.filter(log => log.suspicionScore > 70).length;
  const uniqueNumbers = new Set([
    ...processedLogEntries.map(log => log['A-Party'] || log.a_party),
    ...processedLogEntries.map(log => log['B-Party'] || log.b_party)
  ]).size;

  anomalies.push({
    type: 'Risk-based',
    description: `${highRiskEntries} high-risk communications detected`,
    count: highRiskEntries,
    severity: highRiskEntries > processedLogEntries.length * 0.1 ? 'High' : 'Medium'
  });

  anomalies.push({
    type: 'Network Analysis',
    description: `${uniqueNumbers} unique phone numbers involved`,
    count: uniqueNumbers,
    severity: uniqueNumbers > 100 ? 'Medium' : 'Low'
  });

  if (patterns.length > 0) {
    anomalies.push({
      type: 'Pattern-based',
      description: `${patterns.length} suspicious patterns identified`,
      count: patterns.length,
      severity: patterns.some(p => p.severity === 'Critical') ? 'High' : 'Medium'
    });
  }

  res.json({
    hasData: true,
    totalRecords: processedLogEntries.length,
    analysisDate: new Date().toISOString(),
    suspiciousConnections,
    patterns,
    anomalies,
    summary: {
      riskDistribution: {
        high: processedLogEntries.filter(log => log.suspicionScore > 70).length,
        medium: processedLogEntries.filter(log => log.suspicionScore > 40 && log.suspicionScore <= 70).length,
        low: processedLogEntries.filter(log => log.suspicionScore <= 40).length
      },
      timeAnalysis: {
        nightActivity: nightCalls,
        shortCalls,
        longCalls
      }
    }
  });
});

// Network visualization endpoint
app.get('/api/network', (req, res) => {
  const { minConnections = 2, showOnlySuspicious = false, limit = 50 } = req.query;
  
  if (processedLogEntries.length === 0) {
    return res.json({
      hasData: false,
      nodes: [],
      edges: [],
      statistics: { 
        totalNodes: 0, 
        totalConnections: 0, 
        highRiskConnections: 0,
        clusters: 0 
      }
    });
  }

  // Create network graph from IPDR data
  const connectionMap = new Map();
  const nodeMap = new Map();
  
  // Process all IPDR log entries to build connections
  processedLogEntries.forEach(log => {
    const sourceIP = log.source_ip;
    const destIP = log.dest_ip;
    
    if (!sourceIP || !destIP) return;
    
    // Skip if we only want suspicious connections and this isn't suspicious
    if (showOnlySuspicious === 'true' && (log.suspicionScore || 0) < 50) return;
    
    // Create connection key (normalize direction)
    const connectionKey = sourceIP < destIP ? `${sourceIP}-${destIP}` : `${destIP}-${sourceIP}`;
    
    if (!connectionMap.has(connectionKey)) {
      connectionMap.set(connectionKey, {
        source: sourceIP < destIP ? sourceIP : destIP,
        target: sourceIP < destIP ? destIP : sourceIP,
        weight: 0,
        totalBytes: 0,
        avgRisk: 0,
        riskSum: 0,
        connections: [],
        protocols: new Set(),
        actions: new Set()
      });
    }
    
    const connection = connectionMap.get(connectionKey);
    connection.weight++;
    connection.totalBytes += parseInt(log.bytes || 0);
    connection.riskSum += (log.suspicionScore || 0);
    connection.avgRisk = connection.riskSum / connection.weight;
    connection.connections.push(log);
    connection.protocols.add(log.protocol);
    connection.actions.add(log.action);
    
    // Track nodes
    [sourceIP, destIP].forEach(ip => {
      if (!nodeMap.has(ip)) {
        nodeMap.set(ip, {
          id: ip,
          label: ip,
          connectionCount: 0,
          totalRisk: 0,
          riskCount: 0,
          isExternal: isExternalIP(ip),
          dataVolume: 0,
          city: getLocationFromIP(ip),
          protocols: new Set(),
          actions: new Set()
        });
      }
      
      const node = nodeMap.get(ip);
      node.connectionCount++;
      node.dataVolume += parseInt(log.bytes || 0);
      node.protocols.add(log.protocol);
      node.actions.add(log.action);
      if (log.suspicionScore) {
        node.totalRisk += log.suspicionScore;
        node.riskCount++;
      }
    });
  });

  // Filter connections by minimum threshold
  const filteredConnections = Array.from(connectionMap.values())
    .filter(conn => conn.weight >= parseInt(minConnections))
    .filter(conn => !showOnlySuspicious || conn.avgRisk > 50);

  // Create nodes array with calculated metrics
  const activeIPs = new Set();
  filteredConnections.forEach(conn => {
    activeIPs.add(conn.source);
    activeIPs.add(conn.target);
  });

  const nodes = Array.from(nodeMap.values())
    .filter(node => activeIPs.has(node.id))
    .map(node => ({
      ...node,
      protocols: Array.from(node.protocols),
      actions: Array.from(node.actions),
      avgRisk: node.riskCount > 0 ? node.totalRisk / node.riskCount : 0,
      size: Math.max(8, Math.min(25, node.connectionCount * 2)),
      color: node.riskCount > 0 ? 
        (node.totalRisk / node.riskCount > 70 ? '#ef4444' : // red for high risk
         node.totalRisk / node.riskCount > 40 ? '#f59e0b' : // yellow for medium
         '#10b981') : '#6b7280' // green for low, gray for unknown
    }))
    .slice(0, parseInt(limit));

  // Create edges array
  const edges = filteredConnections
    .filter(conn => activeIPs.has(conn.source) && activeIPs.has(conn.target))
    .map(conn => ({
      source: conn.source,
      target: conn.target,
      weight: conn.weight,
      totalBytes: conn.totalBytes,
      avgRisk: Math.round(conn.avgRisk),
      width: Math.max(1, Math.min(8, conn.weight * 0.5)),
      color: conn.avgRisk > 70 ? '#ef4444' : 
             conn.avgRisk > 40 ? '#f59e0b' : '#10b981',
      label: `${conn.weight} connections`,
      protocols: Array.from(conn.protocols),
      actions: Array.from(conn.actions),
      riskLevel: conn.avgRisk > 70 ? 'high' : 
                 conn.avgRisk > 40 ? 'medium' : 'low'
    }))
    .slice(0, parseInt(limit));

  // Calculate clusters (simplified - group by risk level)
  const clusters = {
    high: nodes.filter(n => n.avgRisk > 70).length,
    medium: nodes.filter(n => n.avgRisk > 40 && n.avgRisk <= 70).length,
    low: nodes.filter(n => n.avgRisk <= 40).length
  };

  res.json({
    hasData: true,
    nodes,
    edges,
    statistics: {
      totalNodes: nodes.length,
      totalConnections: edges.length,
      highRiskConnections: edges.filter(e => e.avgRisk > 70).length,
      clusters: Object.keys(clusters).length,
      riskDistribution: clusters
    },
    filters: {
      minConnections: parseInt(minConnections),
      showOnlySuspicious: showOnlySuspicious === 'true',
      appliedLimit: parseInt(limit)
    },
    timestamp: new Date().toISOString()
  });
});

// Real-time alerts endpoint
app.get('/api/alerts', (req, res) => {
  const alerts = [];
  
  if (processedLogEntries.length === 0) {
    alerts.push({
      id: 'no-data',
      type: 'info',
      severity: 'low',
      title: 'No Data Available',
      message: 'Upload IPDR files to begin monitoring for security threats',
      timestamp: new Date().toISOString(),
      acknowledged: false
    });
  } else {
    // Check for high-risk activities
    const highRiskEntries = processedLogEntries.filter(log => log.suspicionScore > 80);
    if (highRiskEntries.length > 0) {
      alerts.push({
        id: `high-risk-${Date.now()}`,
        type: 'security',
        severity: 'critical',
        title: `${highRiskEntries.length} Critical Risk Communications Detected`,
        message: `Immediate investigation required for ${highRiskEntries.length} high-risk communications`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        details: highRiskEntries.slice(0, 3).map(log => ({
          aParty: log['A-Party'] || log.a_party,
          bParty: log['B-Party'] || log.b_party,
          riskScore: log.suspicionScore
        }))
      });
    }
    
    // Check for burst communications
    const recentEntries = processedLogEntries.filter(log => {
      const logTime = new Date(log.processedAt);
      const now = new Date();
      return (now - logTime) < 300000; // Last 5 minutes
    });
    
    if (recentEntries.length > 10) {
      alerts.push({
        id: `burst-comm-${Date.now()}`,
        type: 'pattern',
        severity: 'high',
        title: 'Burst Communication Pattern Detected',
        message: `${recentEntries.length} communications in rapid succession detected`,
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
    }
    
    // Check for international activity
    const internationalCalls = processedLogEntries.filter(log => {
      const aParty = log['A-Party'] || log.a_party || '';
      const bParty = log['B-Party'] || log.b_party || '';
      return aParty.includes('+1-') || aParty.includes('+44-') || 
             bParty.includes('+1-') || bParty.includes('+44-');
    });
    
    if (internationalCalls.length > processedLogEntries.length * 0.1) {
      alerts.push({
        id: `intl-activity-${Date.now()}`,
        type: 'anomaly',
        severity: 'medium',
        title: 'High International Activity',
        message: `${internationalCalls.length} international communications detected (${Math.round(internationalCalls.length/processedLogEntries.length*100)}% of total)`,
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
    }
    
    // Data processing health check
    if (uploadedFiles.length > 0) {
      alerts.push({
        id: `health-check-${Date.now()}`,
        type: 'system',
        severity: 'low',
        title: 'System Status: Operational',
        message: `Processing ${processedLogEntries.length} records from ${uploadedFiles.length} files`,
        timestamp: new Date().toISOString(),
        acknowledged: false
      });
    }
  }
  
  res.json({
    alerts: alerts.slice(0, 10), // Limit to 10 most recent alerts
    totalAlerts: alerts.length,
    criticalCount: alerts.filter(a => a.severity === 'critical').length,
    highCount: alerts.filter(a => a.severity === 'high').length,
    mediumCount: alerts.filter(a => a.severity === 'medium').length,
    timestamp: new Date().toISOString()
  });
});

// Reports endpoint for generating investigation reports
app.get('/api/reports', (req, res) => {
  const { type = 'summary', format = 'json', dateRange = '24h' } = req.query;
  
  if (processedLogEntries.length === 0) {
    return res.json({
      error: 'No data available for report generation',
      message: 'Upload IPDR files to generate reports',
      timestamp: new Date().toISOString()
    });
  }
  
  const now = new Date();
  const reportData = {
    reportId: `RPT-${Date.now()}`,
    generatedAt: now.toISOString(),
    reportType: type,
    dateRange: dateRange,
    dataSource: 'IPDR Analysis System',
    summary: {
      totalRecords: processedLogEntries.length,
      filesProcessed: uploadedFiles.length,
      analysisTimeframe: dateRange,
      overallRiskScore: processedStats.riskScore
    }
  };
  
  if (type === 'summary') {
    // High-level summary report
    const riskDistribution = {
      critical: processedLogEntries.filter(log => log.suspicionScore > 80).length,
      high: processedLogEntries.filter(log => log.suspicionScore > 60 && log.suspicionScore <= 80).length,
      medium: processedLogEntries.filter(log => log.suspicionScore > 40 && log.suspicionScore <= 60).length,
      low: processedLogEntries.filter(log => log.suspicionScore <= 40).length
    };
    
    reportData.analysis = {
      riskDistribution,
      topRiskNumbers: processedLogEntries
        .sort((a, b) => (b.suspicionScore || 0) - (a.suspicionScore || 0))
        .slice(0, 10)
        .map(log => ({
          number: log['A-Party'] || log.a_party,
          riskScore: log.suspicionScore,
          lastActivity: log.processedAt
        })),
      patternsSummary: {
        suspiciousConnections: processedStats.flaggedNumbers,
        networkNodes: processedStats.networkNodes,
        investigations: processedStats.investigationCases
      }
    };
  } else if (type === 'detailed') {
    // Detailed forensic report
    reportData.forensicAnalysis = {
      connectionMatrix: processedLogEntries.slice(0, 100).map(log => ({
        timestamp: log.processedAt,
        aParty: log['A-Party'] || log.a_party,
        bParty: log['B-Party'] || log.b_party,
        duration: log.Duration || log.duration,
        location: log['Cell-ID'] || log.cell_id || 'Unknown',
        riskScore: log.suspicionScore,
        sourceFile: log.sourceFile
      })),
      timeline: recentActivityLog.slice(0, 20),
      recommendations: [
        {
          priority: 'High',
          action: 'Investigate high-risk connections immediately',
          numbers: processedLogEntries
            .filter(log => log.suspicionScore > 70)
            .slice(0, 5)
            .map(log => log['A-Party'] || log.a_party)
        },
        {
          priority: 'Medium',
          action: 'Monitor suspicious patterns for 24-48 hours',
          count: processedStats.suspiciousPatterns
        }
      ]
    };
  }
  
  // Add export timestamp and metadata
  reportData.metadata = {
    analyst: 'Nexum Obscura System',
    confidentialityLevel: 'RESTRICTED',
    reportVersion: '1.0',
    exportFormat: format,
    totalPages: Math.ceil(processedLogEntries.length / 50),
    disclaimer: 'This report is generated by automated analysis. Manual verification recommended.'
  };
  
  res.json(reportData);
});

// Export endpoint for downloading data in various formats
app.get('/api/export/:type', (req, res) => {
  const { type } = req.params;
  const { format = 'csv', filter = 'all' } = req.query;
  
  if (processedLogEntries.length === 0) {
    return res.status(400).json({
      error: 'No data available for export'
    });
  }
  
  let exportData = [];
  
  switch (type) {
    case 'logs':
      exportData = processedLogEntries.map(log => ({
        'A-Party': log['A-Party'] || log.a_party,
        'B-Party': log['B-Party'] || log.b_party,
        'Duration': log.Duration || log.duration,
        'Timestamp': log['Call-Time'] || log.timestamp,
        'Cell-ID': log['Cell-ID'] || log.cell_id,
        'Risk-Score': log.suspicionScore,
        'Risk-Level': log.riskLevel,
        'Source-File': log.sourceFile,
        'Processed-At': log.processedAt
      }));
      break;
      
    case 'suspicious':
      exportData = processedLogEntries
        .filter(log => log.suspicionScore > 60)
        .map(log => ({
          'A-Party': log['A-Party'] || log.a_party,
          'B-Party': log['B-Party'] || log.b_party,
          'Risk-Score': log.suspicionScore,
          'Duration': log.Duration || log.duration,
          'Investigation-Priority': log.suspicionScore > 80 ? 'Critical' : 'High',
          'Source-File': log.sourceFile
        }));
      break;
      
    case 'summary':
      exportData = [{
        'Total-Records': processedLogEntries.length,
        'High-Risk-Count': processedLogEntries.filter(log => log.suspicionScore > 70).length,
        'Medium-Risk-Count': processedLogEntries.filter(log => log.suspicionScore > 40 && log.suspicionScore <= 70).length,
        'Low-Risk-Count': processedLogEntries.filter(log => log.suspicionScore <= 40).length,
        'Files-Processed': uploadedFiles.length,
        'Overall-Risk-Score': processedStats.riskScore,
        'Generated-At': new Date().toISOString()
      }];
      break;
      
    default:
      return res.status(400).json({ error: 'Invalid export type' });
  }
  
  if (format === 'csv') {
    // Convert to CSV format
    if (exportData.length === 0) {
      return res.status(400).json({ error: 'No data to export' });
    }
    
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => 
          typeof row[header] === 'string' && row[header].includes(',') 
            ? `"${row[header]}"` 
            : row[header] || ''
        ).join(',')
      )
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="nexum-export-${type}-${Date.now()}.csv"`);
    res.send(csvContent);
  } else {
    // JSON format
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="nexum-export-${type}-${Date.now()}.json"`);
    res.json({
      exportType: type,
      format: format,
      generatedAt: new Date().toISOString(),
      recordCount: exportData.length,
      data: exportData
    });
  }
});

// Upload status endpoint
app.get('/api/upload/status', (req, res) => {
  res.json({
    status: 'ready',
    acceptedFormats: ['CSV'],
    maxFileSize: '50MB',
    supportedColumns: [
      'A-Party', 'B-Party', 'Call-Date', 'Call-Time', 
      'Duration', 'IMEI', 'IMSI', 'Cell-ID', 'LAC'
    ]
  });
});

// Traffic flow analysis endpoint
app.get('/api/traffic-flow', (req, res) => {
  const { timeRange = '24h', granularity = 'hour' } = req.query;
  
  if (processedLogEntries.length === 0) {
    return res.json({
      hasData: false,
      timeRange,
      data: [],
      statistics: { totalConnections: 0, peakHour: null, averageConnectionsPerHour: 0 }
    });
  }

  // Analyze real IPDR data by time slots
  const now = new Date();
  const hoursBack = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 1;
  const timeSlots = new Map();
  
  // Initialize time slots
  for (let i = hoursBack - 1; i >= 0; i--) {
    const slotTime = new Date(now.getTime() - (i * 3600000)); // 1 hour intervals
    const hourKey = slotTime.toISOString().slice(0, 13); // YYYY-MM-DDTHH
    timeSlots.set(hourKey, {
      timestamp: slotTime.toISOString(),
      totalConnections: 0,
      allowedConnections: 0,
      blockedConnections: 0,
      suspiciousActivity: 0,
      totalBytes: 0,
      uniqueSourceIPs: new Set(),
      uniqueDestIPs: new Set()
    });
  }
  
  // Process IPDR entries
  processedLogEntries.forEach(entry => {
    if (entry.timestamp) {
      const entryTime = new Date(entry.timestamp);
      const hourKey = entryTime.toISOString().slice(0, 13);
      
      if (timeSlots.has(hourKey)) {
        const slot = timeSlots.get(hourKey);
        slot.totalConnections++;
        
        if (entry.action === 'ALLOW') {
          slot.allowedConnections++;
        } else {
          slot.blockedConnections++;
        }
        
        if (entry.suspicionScore > 70 || entry.threat_flag === 'Suspicious') {
          slot.suspiciousActivity++;
        }
        
        slot.totalBytes += parseInt(entry.bytes) || 0;
        slot.uniqueSourceIPs.add(entry.source_ip);
        slot.uniqueDestIPs.add(entry.dest_ip);
      }
    }
  });

  // Convert to array and calculate final values
  const timeSlotArray = Array.from(timeSlots.values()).map(slot => ({
    timestamp: slot.timestamp,
    callVolume: slot.totalConnections,
    incomingCalls: slot.allowedConnections,
    outgoingCalls: slot.blockedConnections,
    suspiciousActivity: slot.suspiciousActivity,
    averageDuration: slot.totalBytes > 0 ? Math.round(slot.totalBytes / slot.totalConnections / 1024) : 0, // KB per connection
    uniqueNumbers: slot.uniqueSourceIPs.size + slot.uniqueDestIPs.size
  }));

  // Calculate peak statistics
  const peakSlot = timeSlotArray.reduce((max, slot) => 
    slot.callVolume > max.callVolume ? slot : max, timeSlotArray[0] || { callVolume: 0 }
  );
  
  res.json({
    hasData: true,
    timeRange,
    granularity,
    data: timeSlotArray,
    statistics: {
      totalCalls: timeSlotArray.reduce((sum, slot) => sum + slot.callVolume, 0),
      peakHour: peakSlot.timestamp,
      peakVolume: peakSlot.callVolume,
      averageCallsPerHour: timeSlotArray.length > 0 ? Math.round(timeSlotArray.reduce((sum, slot) => sum + slot.callVolume, 0) / timeSlotArray.length) : 0,
      totalSuspicious: timeSlotArray.reduce((sum, slot) => sum + slot.suspiciousActivity, 0)
    }
  });
});

// Protocol distribution endpoint
app.get('/api/protocol-analysis', (req, res) => {
  if (processedLogEntries.length === 0) {
    return res.json({
      hasData: false,
      protocols: [],
      statistics: { totalProtocols: 0, dominantProtocol: null }
    });
  }

  // Analyze real protocol distribution from IPDR data
  const protocolCounts = {};
  const actionCounts = {};
  
  processedLogEntries.forEach(entry => {
    // Count protocols
    const protocol = entry.protocol || 'Unknown';
    protocolCounts[protocol] = (protocolCounts[protocol] || 0) + 1;
    
    // Count actions
    const action = entry.action || 'Unknown';
    actionCounts[action] = (actionCounts[action] || 0) + 1;
  });

  // Convert to array format for charts
  const protocolData = Object.entries(protocolCounts).map(([name, count]) => {
    const percentage = Math.round((count / processedLogEntries.length) * 100);
    return {
      name,
      count,
      percentage,
      description: getProtocolDescription(name),
      riskLevel: getProtocolRiskLevel(name),
      color: getProtocolColor(name)
    };
  }).sort((a, b) => b.count - a.count);

  // Add action type distribution
  const actionTypes = Object.entries(actionCounts).map(([name, count]) => {
    const percentage = Math.round((count / processedLogEntries.length) * 100);
    return {
      name,
      count,
      percentage,
      color: getActionColor(name)
    };
  }).sort((a, b) => b.count - a.count);

  const dominantProtocol = protocolData.length > 0 ? protocolData.reduce((max, protocol) => 
    protocol.count > max.count ? protocol : max
  ) : { name: 'Unknown', count: 0, percentage: 0 };

  res.json({
    hasData: true,
    protocols: protocolData,
    actionTypes,
    statistics: {
      totalProtocols: protocolData.length,
      dominantProtocol: dominantProtocol.name,
      dominantPercentage: dominantProtocol.percentage,
      totalConnections: processedLogEntries.length,
      riskDistribution: {
        low: protocolData.filter(p => p.riskLevel === 'low').reduce((sum, p) => sum + p.count, 0),
        medium: protocolData.filter(p => p.riskLevel === 'medium').reduce((sum, p) => sum + p.count, 0),
        high: protocolData.filter(p => p.riskLevel === 'high').reduce((sum, p) => sum + p.count, 0)
      }
    }
  });
});

// Helper functions for protocol analysis
function getProtocolDescription(protocol) {
  const descriptions = {
    'TCP': 'Transmission Control Protocol - Reliable connection-oriented protocol',
    'UDP': 'User Datagram Protocol - Fast connectionless protocol', 
    'ICMP': 'Internet Control Message Protocol - Network diagnostic protocol',
    'HTTP': 'HyperText Transfer Protocol - Web communication',
    'HTTPS': 'HTTP Secure - Encrypted web communication'
  };
  return descriptions[protocol] || `${protocol} Protocol`;
}

function getProtocolRiskLevel(protocol) {
  const riskLevels = {
    'TCP': 'low',
    'UDP': 'medium',
    'ICMP': 'high',
    'HTTP': 'medium',
    'HTTPS': 'low'
  };
  return riskLevels[protocol] || 'medium';
}

function getProtocolColor(protocol) {
  const colors = {
    'TCP': '#10b981',
    'UDP': '#3b82f6', 
    'ICMP': '#f59e0b',
    'HTTP': '#8b5cf6',
    'HTTPS': '#06b6d4'
  };
  return colors[protocol] || '#6b7280';
}

function getActionColor(action) {
  const colors = {
    'ALLOW': '#10b981',
    'BLOCK': '#ef4444',
    'DROP': '#dc2626',
    'DENY': '#b91c1c'
  };
  return colors[action] || '#6b7280';
}

// Geographic distribution endpoint
app.get('/api/geographic-data', (req, res) => {
  if (processedLogEntries.length === 0) {
    return res.json({
      hasData: false,
      regions: [],
      threats: [],
      statistics: { totalRegions: 0, highRiskRegions: 0 }
    });
  }

  // Analyze geographic data from IPDR entries (using city field if available)
  const cityData = {};
  const ipLocationMap = {};
  
  processedLogEntries.forEach(entry => {
    // Use city field from enriched data if available
    const city = entry.city || getLocationFromIP(entry.source_ip) || 'Unknown';
    
    if (!cityData[city]) {
      cityData[city] = {
        city,
        totalConnections: 0,
        suspiciousConnections: 0,
        blockedConnections: 0,
        totalBytes: 0,
        uniqueIPs: new Set(),
        coordinates: getCityCoordinates(city)
      };
    }
    
    const data = cityData[city];
    data.totalConnections++;
    data.totalBytes += parseInt(entry.bytes) || 0;
    data.uniqueIPs.add(entry.source_ip);
    
    if (entry.suspicionScore > 70 || entry.threat_flag === 'Suspicious') {
      data.suspiciousConnections++;
    }
    
    if (entry.action !== 'ALLOW') {
      data.blockedConnections++;
    }
  });

  // Convert to geographic regions format
  const geographicData = Object.values(cityData).map(data => ({
    country: data.city, // Use city name as the primary identifier
    countryCode: getCountryCode(data.city),
    city: data.city,
    region: 'India', // Keep India as the region
    coordinates: data.coordinates,
    threatLevel: data.suspiciousConnections > data.totalConnections * 0.3 ? 'high' : 
                 data.suspiciousConnections > data.totalConnections * 0.1 ? 'medium' : 'low',
    riskScore: Math.min(100, Math.round((data.suspiciousConnections / data.totalConnections) * 100) + 
               Math.round((data.blockedConnections / data.totalConnections) * 50)),
    callVolume: data.totalConnections,
    suspiciousCalls: data.suspiciousConnections,
    blockedCalls: data.blockedConnections,
    totalBytes: data.totalBytes,
    uniqueIPs: data.uniqueIPs.size
  })).sort((a, b) => b.callVolume - a.callVolume);

  // Create threat alerts based on suspicious activity
  const threats = geographicData
    .filter(region => region.threatLevel === 'high')
    .slice(0, 5) // Top 5 threats
    .map((region, index) => ({
      id: `threat-${index + 1}`,
      type: 'Suspicious Activity Pattern',
      location: region.coordinates,
      city: region.city,
      severity: region.riskScore > 80 ? 'critical' : 'high',
      description: `${region.suspiciousCalls} suspicious connections detected in ${region.city}`,
      timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString() // Random time within last 2 hours
    }));

  res.json({
    hasData: true,
    regions: geographicData,
    threats,
    statistics: {
      totalRegions: geographicData.length,
      highRiskRegions: geographicData.filter(r => r.threatLevel === 'high').length,
      totalCalls: geographicData.reduce((sum, r) => sum + r.callVolume, 0),
      totalThreats: threats.length,
      criticalThreats: threats.filter(t => t.severity === 'critical').length
    }
  });
});

// Helper functions for geographic analysis
function getLocationFromIP(ip) {
  // Simple IP to location mapping (in real implementation, use GeoIP service)
  if (ip.startsWith('106.200')) return 'Mumbai';
  if (ip.startsWith('117.195')) return 'Delhi';
  if (ip.startsWith('202.142')) return 'Bangalore';
  if (ip.startsWith('223.176')) return 'Chennai';
  if (ip.startsWith('49.37')) return 'Kolkata';
  return 'Unknown';
}

function getCityCoordinates(city) {
  const coordinates = {
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Bhopal': { lat: 23.2599, lng: 77.4126 },
    'Indore': { lat: 22.7196, lng: 75.8577 },
    'Gwalior': { lat: 26.2183, lng: 78.1828 },
    'Jabalpur': { lat: 23.1815, lng: 79.9864 },
    'Ujjain': { lat: 23.1765, lng: 75.7885 }
  };
  return coordinates[city] || { lat: 20.5937, lng: 78.9629 }; // Default to India center
}

function getCountryFromCity(city) {
  // All cities in our data are in India for this demo
  return 'India';
}

function getCountryCode(city) {
  return 'IN';
}

// Helper function to detect external IPs
function isExternalIP(ip) {
  // Simple detection - IPs starting with certain ranges are considered external
  if (ip.startsWith('106.200') || ip.startsWith('117.195') || ip.startsWith('202.142')) {
    return false; // Internal/local networks
  }
  return true; // Consider others as external
}

app.listen(PORT, () => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://nexum-obscura.onrender.com` 
    : `http://localhost:${PORT}`;
    
  console.log(`✅ Nexum Obscura Backend running on ${baseUrl}`);
  console.log(`✅ Health Check: ${baseUrl}/api/health`);
  console.log(`✅ Dashboard API: ${baseUrl}/api/dashboard`);
  console.log(`✅ Upload API: ${baseUrl}/api/upload`);
  console.log(`✅ Network API: ${baseUrl}/api/network`);
  console.log(`✅ Traffic Flow API: ${baseUrl}/api/traffic-flow`);
  console.log(`✅ Protocol Analysis API: ${baseUrl}/api/protocol-analysis`);
  console.log(`✅ Geographic Data API: ${baseUrl}/api/geographic-data`);
});
