# Nexum Obscura Backend - Render Deployment

## Environment Variables Required:
- NODE_ENV=production
- PORT=10000

## Build Command:
npm install

## Start Command:
npm start

## Root Directory:
backend/

## Auto-Deploy:
Yes (connected to GitHub repository)

## Health Check Endpoint:
/api/health

## API Endpoints:
- GET /api/health - Health check
- GET /api/dashboard - Dashboard statistics
- POST /api/upload - File upload
- GET /api/analysis - Analysis results
- GET /api/network - Network data
- GET /api/alerts - Security alerts
- GET /api/reports - Investigation reports
- GET /api/export/:type - Export data

## Notes:
- The backend includes sample IPDR data for demonstration
- CORS is configured to allow frontend access
- File uploads are handled with multer (memory storage for demo)
- MongoDB connection is optional (uses in-memory data for demo)
