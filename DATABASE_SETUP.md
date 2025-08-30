# 🗄️ Database Setup Guide for Nexum Obscura

This guide covers database setup for both development and production environments.

## 📊 Database Architecture

The Nexum Obscura platform uses MongoDB with the following collections:
- **ipdrlogs** - IPDR call detail records
- **investigations** - Investigation cases and findings
- **alerts** - Security alerts and notifications
- **reports** - Generated analysis reports

## 🔧 Development Setup

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition**
   ```bash
   # Windows (using Chocolatey)
   choco install mongodb
   
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install -y mongodb
   ```

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

3. **Create Local Environment File**
   ```bash
   cd backend
   cp .env.example .env.local
   ```
   
   Update `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/nexum-obscura-dev
   ```

### Option 2: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for free tier (512MB storage)

2. **Create Cluster**
   - Choose "Shared" (free tier)
   - Select cloud provider and region
   - Cluster name: `nexum-obscura-cluster`

3. **Configure Database Access**
   - Go to "Database Access"
   - Add new database user with read/write permissions
   - Username: `nexum-user`
   - Generate secure password

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP address: `0.0.0.0/0` (for development/testing)
   - For production: Add specific IP addresses

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

6. **Update Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://nexum-user:<password>@nexum-obscura-cluster.xxxxx.mongodb.net/nexum-obscura?retryWrites=true&w=majority
   ```

## 🚀 Production Deployment

### Render Deployment with MongoDB Atlas

1. **Create MongoDB Atlas Production Cluster**
   - Follow steps above for Atlas setup
   - Use production cluster settings
   - Create dedicated database user for production

2. **Configure Render Environment Variables**
   In your Render service dashboard, add:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://production-user:<password>@nexum-obscura-prod.xxxxx.mongodb.net/nexum-obscura-prod?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-production-jwt-secret
   MAX_FILE_SIZE=10485760
   ```

3. **Security Considerations**
   - Use strong passwords for database users
   - Restrict network access to known IPs
   - Enable authentication and SSL
   - Regular backup schedule

## 📋 Database Schema

### IPDR Logs Collection
```javascript
{
  aParty: "string",           // Calling party number
  bParty: "string",           // Called party number  
  duration: "number",         // Call duration in seconds
  callTime: "date",           // Call timestamp
  cellId: "string",           // Cell tower ID
  suspicionScore: "number",   // Risk score (0-100)
  riskLevel: "string",        // Low/Medium/High/Critical
  sourceFile: "string",       // Original file name
  processedAt: "date",        // Processing timestamp
  geoLocation: {              // Optional location data
    latitude: "number",
    longitude: "number", 
    location: "string"
  },
  flags: ["string"],          // Investigation flags
  investigationId: "ObjectId" // Associated investigation
}
```

### Investigations Collection
```javascript
{
  caseId: "string",           // Unique case identifier
  title: "string",            // Investigation title
  status: "string",           // Open/In Progress/Resolved/Closed
  priority: "string",         // Low/Medium/High/Critical
  assignedTo: "string",       // Analyst name
  targetNumbers: [            // Target phone numbers
    {
      number: "string",
      role: "string"          // primary/secondary/witness
    }
  ],
  relatedLogs: ["ObjectId"],  // Related IPDR logs
  findings: [                 // Investigation findings
    {
      timestamp: "date",
      description: "string",
      evidence: "string",
      analyst: "string"
    }
  ]
}
```

## 🔍 Database Operations

### Sample Queries

```javascript
// Find high-risk calls
db.ipdrlogs.find({ riskLevel: "High" })

// Find frequent callers
db.ipdrlogs.aggregate([
  { $group: { _id: "$aParty", count: { $sum: 1 } } },
  { $match: { count: { $gte: 5 } } },
  { $sort: { count: -1 } }
])

// Find calls by date range
db.ipdrlogs.find({
  callTime: {
    $gte: ISODate("2025-08-01"),
    $lte: ISODate("2025-08-31")
  }
})

// Find network connections for a number
db.ipdrlogs.find({
  $or: [
    { aParty: "+91-9876543210" },
    { bParty: "+91-9876543210" }
  ]
})
```

## 🛠️ Maintenance

### Backup Strategy
```bash
# MongoDB Atlas - Automatic backups included
# Local MongoDB backup
mongodump --db nexum-obscura-dev --out ./backup/

# Restore from backup
mongorestore --db nexum-obscura-dev ./backup/nexum-obscura-dev/
```

### Performance Optimization
- Index commonly queried fields (phone numbers, timestamps)
- Use aggregation pipelines for complex queries
- Monitor query performance with explain()
- Regular database maintenance and cleanup

## 🐛 Troubleshooting

### Common Issues

**Connection Errors:**
- Check network access whitelist in Atlas
- Verify connection string format
- Ensure database user has proper permissions

**Performance Issues:**
- Add indexes for frequently queried fields
- Use pagination for large result sets
- Monitor Atlas performance metrics

**Memory Issues:**
- Implement data archiving for old records
- Use projection to limit returned fields
- Optimize aggregation pipelines

## ✅ Verification

Test your database setup:

1. **Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Database Status**
   Check application logs for:
   ```
   ✅ MongoDB connected successfully
   📊 Database: nexum-obscura-dev
   ✅ Database integration active
   ```

3. **Sample Data**
   Verify sample data is loaded in database or in-memory storage.

Your database is now ready for the Nexum Obscura cybersecurity investigation platform! 🛡️
