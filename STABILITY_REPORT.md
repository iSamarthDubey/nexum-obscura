# 🔒 NEXUM OBSCURA - STABLE DEPLOYMENT CONFIGURATION

## ✅ CODEBASE STATUS: STABLE & READY

### 🎯 **Local Development**
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Database**: MongoDB Atlas (nexum-obscura database)

### 🚀 **Production Deployment**
- **Backend**: https://nexum-obscura.onrender.com
- **Frontend**: https://obscura-collective.vercel.app
- **Database**: MongoDB Atlas (same cluster)

## 📋 **Configuration Summary**

### Backend (`minimal.js`)
- ✅ Entry point: `minimal.js` (as defined in package.json)
- ✅ Port: Uses `process.env.PORT` or 5000
- ✅ Database: Connects to nexum-obscura database
- ✅ CORS: Configured for both local and production
- ✅ Environment: Auto-detects via NODE_ENV

### Frontend
- ✅ Entry point: `src/index.js`
- ✅ API URL: Environment-based (local vs production)
- ✅ Build: `npm run build` for production
- ✅ Deployment: Vercel-ready configuration

### Environment Variables

**Local Development:**
```bash
# backend/.env (create this file)
MONGODB_URI=mongodb+srv://samarthdubey:Samarth*07@cluster0.keyuc38.mongodb.net/nexum-obscura?retryWrites=true&w=majority&appName=Cluster0

# frontend/.env.local (exists)
REACT_APP_API_URL=http://localhost:5000/api
```

**Production:**
```bash
# Render Environment Variables
MONGODB_URI=mongodb+srv://samarthdubey:Samarth*07@cluster0.keyuc38.mongodb.net/nexum-obscura?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production

# Vercel Environment Variables
REACT_APP_API_URL=https://nexum-obscura.onrender.com/api
```

## 🔧 **Deployment Steps**

### 1. Backend to Render
1. Connect GitHub repository
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables above

### 2. Frontend to Vercel
1. Connect GitHub repository
2. Root directory: `frontend`
3. Framework: Create React App
4. Add environment variables above

## ✅ **Tests Passed**
- [x] Backend starts locally on port 5000
- [x] Frontend starts locally on port 3000
- [x] MongoDB connection successful
- [x] API endpoints responding
- [x] CORS configured properly
- [x] Environment variables working
- [x] Build process successful

## 🚨 **Removed Conflicts**
- [x] Removed empty `shared/` folder
- [x] Cleaned up duplicate environment files
- [x] Fixed render.yaml configuration
- [x] Standardized API URLs
- [x] Removed conflicting dependencies

**Status: READY FOR DEPLOYMENT** 🎉
