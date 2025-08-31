# 🚀 Complete Deployment Guide - Nexum Obscura

## 📋 Prerequisites Checklist
- [x] GitHub repository ready
- [x] MongoDB Atlas cluster configured
- [x] Render account created
- [x] Vercel account created

## 🔧 Step-by-Step Deployment

### 1️⃣ **Deploy Backend to Render**

1. **Go to Render Dashboard**
   - Visit: https://render.com
   - Click "New" → "Web Service"

2. **Connect Repository**
   - Select "Build and deploy from a Git repository"
   - Connect your GitHub account
   - Select `nexum-obscura` repository
   - Set **Root Directory**: `backend`

3. **Configure Service**
   - **Name**: `nexum-obscura-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://samarthdubey:Samarth*07@cluster0.keyuc38.mongodb.net/nexum-obscura?retryWrites=true&w=majority&appName=Cluster0
   PORT=5000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://nexum-obscura-backend-xxxx.onrender.com`

### 2️⃣ **Deploy Frontend to Vercel**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Click "New Project"

2. **Import Repository**
   - Select `nexum-obscura` repository
   - Set **Root Directory**: `frontend`
   - **Framework Preset**: Create React App

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://YOUR_RENDER_BACKEND_URL.onrender.com/api
   ```
   ⚠️ **Replace with your actual Render URL from Step 1**

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (3-5 minutes)
   - Your frontend will be live at: `https://nexum-obscura-xxxx.vercel.app`

### 3️⃣ **Update Backend CORS (Important!)**

After both are deployed, update your backend CORS settings:

1. Go to Render backend logs
2. Find your Vercel frontend URL
3. Update `minimal.js` CORS configuration if needed

### 4️⃣ **Test Deployment**

1. **Backend Health Check**
   ```
   https://YOUR_RENDER_URL.onrender.com/api/health
   ```
   Should return: `{"status":"OK"}`

2. **Frontend Access**
   ```
   https://YOUR_VERCEL_URL.vercel.app
   ```
   Should load the dashboard

3. **API Integration**
   - Open browser developer tools
   - Check Network tab for API calls
   - Verify calls go to Render backend, not localhost

## 🔍 **Troubleshooting**

### ❌ "Cannot connect to backend"
- Check Vercel environment variables
- Verify Render backend is running
- Check CORS configuration

### ❌ "MongoDB connection failed"
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for all IPs)
- Check connection string in Render environment variables
- Ensure database user has read/write permissions

### ❌ "Build failed"
- Check build logs in Render/Vercel dashboard
- Verify all dependencies in package.json
- Check for any syntax errors

## 🎯 **Final Architecture**

```
Internet User
    ↓
Vercel Frontend (React)
    ↓ (API calls)
Render Backend (Node.js/Express)
    ↓ (Database queries)
MongoDB Atlas (Cloud Database)
```

## 🏆 **Success Checklist**
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] API calls working between frontend/backend
- [ ] MongoDB connection active
- [ ] Dashboard loading with data
- [ ] Upload functionality working

## 📞 **Support**
If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for errors

**Your Nexum Obscura platform is ready for the National CyberShield Hackathon 2025!** 🎉
