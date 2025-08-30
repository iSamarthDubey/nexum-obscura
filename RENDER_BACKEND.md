# Render Deployment Configuration

## Backend Service Setup

1. **Create New Web Service on Render**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `iSamarthDubey/nexum-obscura`

2. **Configuration Settings**
   ```
   Name: nexum-obscura-backend
   Root Directory: backend
   Environment: Node
   Region: Oregon (US West) or your preferred region
   Branch: main
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   ```

4. **Auto-Deploy Settings**
   - Enable "Auto-Deploy" for automatic deployments on git push
   - Choose "main" branch for deployments

## Expected Deployment URL
Your backend will be available at: `https://nexum-obscura-backend.onrender.com`

## API Endpoints Available
- `GET /api/health` - Health check
- `GET /api/dashboard` - Dashboard statistics  
- `POST /api/upload` - File upload
- `GET /api/analysis` - Analysis results
- `GET /api/network` - Network data
- `GET /api/alerts` - Security alerts
- `GET /api/reports` - Investigation reports
- `GET /api/export/:type` - Export data

## Important Notes
- Render free tier may have cold start delays
- The service includes sample IPDR data for demonstration
- CORS is pre-configured for frontend access
- File uploads use memory storage (suitable for demo)
