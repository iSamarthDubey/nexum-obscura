# 🚀 Nexum Obscura - Production Deployment Guide

## 🔧 Pre-Deployment Checklist

✅ **Fixed Issues:**
- Removed hardcoded MongoDB credentials from render.yaml
- Fixed CORS configuration syntax error
- Added proper environment variables
- Configured health check endpoint
- Set up proper API URL configuration

---

## 📋 **STEP 1: Deploy Backend to Render**

### 1. **Go to Render Dashboard**
1. Visit: https://render.com
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub account
4. Select `nexum-obscura` repository

### 2. **Configure Service Settings**
```
Name: nexum-obscura-backend
Root Directory: backend
Environment: Node
Branch: main
Build Command: npm install
Start Command: npm start
```

### 3. **Add Environment Variables** (❗ IMPORTANT)
In Render Dashboard → Environment tab, add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://samarthdubey:Samarth*07@cluster0.keyuc38.mongodb.net/nexum-obscura?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-for-production-2025-nexum-obscura
PORT=10000
```

### 4. **Deploy & Test**
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy your backend URL (e.g., `https://nexum-obscura-backend-abc123.onrender.com`)
4. Test health check: `YOUR_BACKEND_URL/api/health`

---

## 📋 **STEP 2: Deploy Frontend to Vercel**

### 1. **Update Frontend API URL**
Before deploying, update the API URL with your actual backend URL:

Edit `frontend/.env.production`:
```bash
REACT_APP_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
REACT_APP_ENVIRONMENT=production
```

### 2. **Go to Vercel Dashboard**
1. Visit: https://vercel.com
2. Click **"New Project"**
3. Import your GitHub repository

### 3. **Configure Project Settings**
```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
```

### 4. **Add Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:
```
REACT_APP_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
```

### 5. **Deploy & Test**
1. Click **"Deploy"**
2. Wait 2-5 minutes for deployment
3. Test your application at the provided Vercel URL

---

## ✅ **Verification Steps**

### **Backend Health Check**
Visit: `https://YOUR-BACKEND-URL.onrender.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-08-31T...",
  "environment": "production",
  "database": "connected",
  "uptime": 123.45,
  "version": "1.0.0",
  "service": "nexum-obscura-backend"
}
```

### **Frontend Testing**
1. Open your Vercel URL
2. Check browser console for any errors
3. Test file upload functionality
4. Verify dashboard displays sample data
5. Test navigation between pages

---

## 🔧 **Quick Commands for Local Testing**

```powershell
# Test backend locally
cd backend
npm install
npm start
# Visit: http://localhost:5000/api/health

# Test frontend locally  
cd frontend
npm install
npm start
# Visit: http://localhost:3000
```

---

## 🚨 **Common Issues & Solutions**

### **CORS Errors**
If you see "Access blocked by CORS policy":
- Verify your Vercel URL is included in the CORS whitelist
- Check that environment variables are set correctly

### **API Connection Failed**
If frontend can't connect to backend:
- Verify `REACT_APP_API_URL` in Vercel environment variables
- Test backend health endpoint directly
- Check Render logs for backend errors

### **MongoDB Connection Issues**
If database connection fails:
- Verify `MONGODB_URI` environment variable in Render
- Check MongoDB Atlas IP whitelist (should allow all IPs: 0.0.0.0/0)

---

## 🎯 **Expected Final URLs**

| Service | URL Pattern |
|---------|-------------|
| Backend | `https://nexum-obscura.onrender.com` |
| Frontend | `https://obscura-collective.vercel.app` |
| Health Check | `https://nexum-obscura.onrender.com/api/health` |

---

## 🎉 **You're Done!**

Once both deployments are successful:
1. ✅ Your backend will be running on Render
2. ✅ Your frontend will be running on Vercel  
3. ✅ Health check endpoint will be available
4. ✅ All CORS issues will be resolved
5. ✅ Sample data will be visible on the dashboard

Your Nexum Obscura cybersecurity platform is now production-ready! 🚀
