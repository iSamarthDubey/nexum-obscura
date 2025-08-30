# 🚀 Complete Hosting Guide - Nexum Obscura Platform

## Step-by-Step Guide to Host Your Cybersecurity Platform

### 📋 Prerequisites Checklist
- ✅ GitHub repository: `iSamarthDubey/nexum-obscura`
- ✅ Code pushed to main branch
- ✅ Accounts needed: Render.com, Vercel.com, MongoDB Atlas

---

## 🗄️ STEP 1: Setup Database (MongoDB Atlas) - 5 minutes

### 1.1 Create MongoDB Atlas Account
1. Go to **[mongodb.com/atlas](https://mongodb.com/atlas)**
2. Click **"Try Free"**
3. Sign up with Google/GitHub or create new account
4. Choose **"I'm learning MongoDB"** when asked

### 1.2 Create Your First Cluster
1. **Choose Deployment**: Select **"M0 Sandbox"** (FREE)
2. **Cloud Provider**: Keep default (AWS)
3. **Region**: Choose closest to your location
4. **Cluster Name**: `nexum-obscura-cluster`
5. Click **"Create Cluster"** (takes 2-3 minutes)

### 1.3 Create Database User
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `nexum-admin`
5. **Password**: Click "Autogenerate Secure Password" and **SAVE IT**
6. **Database User Privileges**: Select **"Read and write to any database"**
7. Click **"Add User"**

### 1.4 Configure Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
4. Click **"Confirm"**

### 1.5 Get Connection String
1. Go to **"Clusters"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js, **Version**: 4.1 or later
5. **Copy** the connection string (looks like):
   ```
   mongodb+srv://nexum-admin:<password>@nexum-obscura-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace** `<password>` with your actual password
7. **Add database name** at the end: `/nexum-obscura`

**Final connection string example:**
```
mongodb+srv://nexum-admin:YourSecurePassword123@nexum-obscura-cluster.xxxxx.mongodb.net/nexum-obscura?retryWrites=true&w=majority
```

---

## 🖥️ STEP 2: Deploy Backend (Render) - 10 minutes

### 2.1 Create Render Account
1. Go to **[render.com](https://render.com)**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your repositories

### 2.2 Create Web Service
1. From Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect to your repository: **"iSamarthDubey/nexum-obscura"**
4. Click **"Connect"**

### 2.3 Configure Service Settings
Fill in these **EXACT** settings:

```
Name: nexum-obscura-backend
Environment: Node
Region: Oregon (US West) or your preferred region
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 2.4 Set Environment Variables
Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | `your-connection-string-from-step-1.5` |
| `JWT_SECRET` | `your-super-secure-random-string-123` |
| `MAX_FILE_SIZE` | `10485760` |

### 2.5 Deploy
1. Click **"Create Web Service"**
2. **Wait 5-10 minutes** for deployment
3. **Note your backend URL**: `https://nexum-obscura-backend.onrender.com`

### 2.6 Test Backend
1. Visit: `https://nexum-obscura-backend.onrender.com/api/health`
2. Should see: `{"status":"healthy","message":"Nexum Obscura Backend is running"}`

---

## 🌐 STEP 3: Deploy Frontend (Vercel) - 5 minutes

### 3.1 Create Vercel Account
1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Start Deploying"**
3. **Continue with GitHub**
4. Authorize Vercel to access your repositories

### 3.2 Import Project
1. From Vercel Dashboard, click **"New Project"**
2. Import **"iSamarthDubey/nexum-obscura"**
3. Click **"Import"**

### 3.3 Configure Project Settings
Configure these **EXACT** settings:

```
Project Name: nexum-obscura-frontend
Framework Preset: Create React App (auto-detected)
Root Directory: frontend
Build Command: npm run build (auto-detected)
Output Directory: build (auto-detected)
Install Command: npm install (auto-detected)
```

### 3.4 Set Environment Variables
Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://nexum-obscura-backend.onrender.com/api` |
| `REACT_APP_ENV` | `production` |
| `GENERATE_SOURCEMAP` | `false` |

### 3.5 Deploy
1. Click **"Deploy"**
2. **Wait 2-3 minutes** for deployment
3. **Note your frontend URL**: `https://nexum-obscura-frontend.vercel.app`

---

## 🧪 STEP 4: Test Your Live Application - 2 minutes

### 4.1 Test Backend API
Visit these URLs:
- Health Check: `https://nexum-obscura-backend.onrender.com/api/health`
- Dashboard Data: `https://nexum-obscura-backend.onrender.com/api/dashboard`

### 4.2 Test Frontend Application
1. Visit: `https://nexum-obscura-frontend.vercel.app`
2. Check dashboard loads properly
3. Verify "Backend: Connected" status in header
4. Test uploading a sample CSV file
5. Check all navigation links work

---

## 🔧 STEP 5: Configure Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to your project in Vercel Dashboard
2. Click **"Domains"** tab
3. Add your custom domain
4. Configure DNS as instructed

### For Render (Backend):
1. Go to your service in Render Dashboard
2. Click **"Settings"** → **"Custom Domains"**
3. Add your custom domain
4. Configure DNS as instructed

---

## 📊 Your Live URLs

After successful deployment:

🌐 **Frontend**: `https://nexum-obscura-frontend.vercel.app`
🔧 **Backend**: `https://nexum-obscura-backend.onrender.com`
📊 **API Health**: `https://nexum-obscura-backend.onrender.com/api/health`
🗄️ **Database**: MongoDB Atlas Cluster

---

## 🐛 Troubleshooting Common Issues

### ❌ "Application Error" on Render
**Solution**: Check environment variables, especially `MONGODB_URI`

### ❌ Frontend shows "Backend: Disconnected"
**Solution**: 
1. Verify backend URL in Vercel environment variables
2. Check Render service is running
3. Test backend health endpoint directly

### ❌ Database connection issues
**Solution**:
1. Verify MongoDB Atlas network access allows all IPs
2. Check connection string includes database name
3. Ensure database user has read/write permissions

### ❌ Build failures
**Solution**:
1. Check Node.js version compatibility
2. Verify all dependencies are in package.json
3. Check build logs for specific errors

---

## 🎉 Deployment Complete!

### Features Now Live:
- ✅ Real-time IPDR analysis dashboard
- ✅ CSV file upload and processing
- ✅ Network visualization with Cytoscape.js
- ✅ Security alerts and threat monitoring
- ✅ Investigation reports and export
- ✅ MongoDB database integration
- ✅ Production-ready scaling

### Performance Notes:
- **Render free tier**: May have cold starts (30-second delay)
- **Vercel**: Instant loading with global CDN
- **MongoDB Atlas**: 512MB free storage

**🛡️ Your Nexum Obscura cybersecurity investigation platform is now LIVE and ready for the National CyberShield Hackathon 2025!**

### Next Steps:
1. Test all features thoroughly
2. Load test with larger datasets
3. Share URLs with your team
4. Monitor performance and logs
