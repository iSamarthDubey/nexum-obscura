const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Log = require('../models/Log');
const { parseLogEntry, calculateSuspicionScore } = require('../utils/parser');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
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

// Upload and parse CSV log file
router.post('/', upload.single('logFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const results = [];
    let processedCount = 0;
    let errorCount = 0;

    // Parse CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (data) => {
        try {
          const parsedLog = parseLogEntry(data);
          parsedLog.suspicionScore = calculateSuspicionScore(parsedLog);
          results.push(parsedLog);
          processedCount++;
        } catch (error) {
          console.error('Error parsing log entry:', error);
          errorCount++;
        }
      })
      .on('end', async () => {
        try {
          // Batch insert to database
          if (results.length > 0) {
            await Log.insertMany(results);
          }

          // Clean up uploaded file
          fs.unlinkSync(filePath);

          res.json({
            message: 'File uploaded and processed successfully',
            processed: processedCount,
            errors: errorCount,
            total: processedCount + errorCount
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
          res.status(500).json({ error: 'Failed to save logs to database' });
        }
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        res.status(500).json({ error: 'Failed to parse CSV file' });
      });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process upload' });
  }
});

// Get upload status
router.get('/status', async (req, res) => {
  try {
    const totalLogs = await Log.countDocuments();
    const suspiciousLogs = await Log.countDocuments({ suspicionScore: { $gte: 70 } });
    
    res.json({
      totalLogs,
      suspiciousLogs,
      lastUpload: await Log.findOne().sort({ createdAt: -1 }).select('createdAt')
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Failed to get upload status' });
  }
});

module.exports = router;
