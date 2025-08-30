# 🚀 Nexum Obscura Deployment Guide

Complete guide to deploy the Nexum Obscura cybersecurity investigation platform to production.

## 📋 Prerequisites

- GitHub account with the repository pushed
- Render account (for backend) - [render.com](https://render.com)
- Vercel account (for frontend) - [vercel.com](https://vercel.com)

## 🔧 Step 1: Backend Deployment (Render)

### 1.1 Create Render Service
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select repository: `iSamarthDubey/nexum-obscura`

### 1.2 Configure Service Settings
```
Name: nexum-obscura-backend
Environment: Node
Region: Oregon (US West) or your preferred region
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 1.3 Environment Variables
Add these environment variables in Render dashboard:
```
NODE_ENV=production
PORT=10000
```

### 1.4 Deploy
- Click **"Create Web Service"**
- Render will automatically build and deploy your backend
- Note the deployment URL: `https://nexum-obscura-backend.onrender.com`

## 🎨 Step 2: Frontend Deployment (Vercel)

### 2.1 Create Vercel Project
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository: `iSamarthDubey/nexum-obscura`

### 2.2 Configure Project Settings
```
Project Name: nexum-obscura-frontend
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build (auto-detected)
Output Directory: build (auto-detected)
Install Command: npm install (auto-detected)
```

### 2.3 Environment Variables
Vercel will automatically use the production environment variables from `.env.production`:
```
REACT_APP_API_URL=https://nexum-obscura-backend.onrender.com/api
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

### 2.4 Deploy
- Click **"Deploy"**
- Vercel will build and deploy your frontend
- Note the deployment URL: `https://nexum-obscura-frontend.vercel.app`

## 🔄 Step 3: Update Backend CORS (if needed)

If you use a different Vercel domain, update the CORS configuration in `backend/minimal.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-actual-vercel-domain.vercel.app',
    /\.vercel\.app$/,
    /localhost/
  ],
  credentials: true
};
```

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend
Visit: `https://nexum-obscura-backend.onrender.com/api/health`
Expected response:
```json
{
  "status": "healthy",
  "message": "Nexum Obscura Backend is running",
  "timestamp": "2025-08-30T..."
}
```

### 4.2 Test Frontend
Visit: `https://nexum-obscura-frontend.vercel.app`
- Should load the dashboard
- Should display "Backend: Connected" status
- Should show sample IPDR data

## 🔧 Step 5: Custom Domain (Optional)

### 5.1 Vercel Custom Domain
1. Go to your Vercel project dashboard
2. Click **"Domains"**
3. Add your custom domain
4. Configure DNS records as instructed

### 5.2 Render Custom Domain
1. Go to your Render service dashboard
2. Click **"Settings"** → **"Custom Domains"**
3. Add your custom domain
4. Configure DNS records as instructed

## 🚀 Deployment URLs

After successful deployment:

- **Frontend**: https://nexum-obscura-frontend.vercel.app
- **Backend**: https://nexum-obscura-backend.onrender.com
- **API Health**: https://nexum-obscura-backend.onrender.com/api/health

## 📝 Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Health check endpoint working
- [ ] Frontend connecting to backend
- [ ] Sample data loading correctly
- [ ] All features functional (Upload, Analysis, Visualization)

## 🐛 Troubleshooting

### Backend Issues
- Check Render logs in the service dashboard
- Verify environment variables are set
- Ensure `package.json` start script is correct

### Frontend Issues
- Check Vercel function logs
- Verify API URL in environment variables
- Check browser console for CORS errors

### CORS Issues
- Verify backend CORS configuration includes Vercel domain
- Check that credentials are properly configured

## 🎉 Success!

Your Nexum Obscura cybersecurity investigation platform is now live and ready for the National CyberShield Hackathon 2025!

### Features Available:
- ✅ Real-time IPDR analysis dashboard
- ✅ CSV file upload and processing
- ✅ Network visualization with Cytoscape.js
- ✅ Security alerts and threat monitoring
- ✅ Investigation reports and export functionality
- ✅ Geographic threat mapping
- ✅ System health monitoring
- ✅ Incident timeline tracking
