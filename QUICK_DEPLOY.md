# 🎯 Quick Hosting Commands & URLs

## 🚨 URGENT: Copy These URLs After Deployment

### Your Project URLs (Fill these in after deployment):
```
Frontend URL: https://nexum-obscura-frontend.vercel.app
Backend URL:  https://nexum-obscura-backend.onrender.com
Health Check: https://nexum-obscura-backend.onrender.com/api/health
MongoDB:      mongodb+srv://nexum-admin:PASSWORD@nexum-obscura-cluster.xxxxx.mongodb.net/nexum-obscura
```

## ⚡ Super Quick Deployment (15 minutes total)

### 1️⃣ MongoDB Atlas (5 min)
1. **mongodb.com/atlas** → Sign up → Free M0 cluster
2. **Database Access** → Add user: `nexum-admin`
3. **Network Access** → Allow 0.0.0.0/0
4. **Connect** → Copy connection string → Replace password

### 2️⃣ Render Backend (5 min)
1. **render.com** → Sign up with GitHub
2. **New+** → Web Service → Connect `iSamarthDubey/nexum-obscura`
3. **Settings**:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. **Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=your-connection-string-here
   JWT_SECRET=random-secure-string-123
   ```

### 3️⃣ Vercel Frontend (5 min)
1. **vercel.com** → Sign up with GitHub
2. **New Project** → Import `iSamarthDubey/nexum-obscura`
3. **Settings**:
   - Root Directory: `frontend`
   - Framework: Create React App
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
   REACT_APP_ENV=production
   ```

## 🧪 Test Commands

After deployment, test these URLs:

### Backend Tests:
```bash
# Health check
curl https://nexum-obscura-backend.onrender.com/api/health

# Dashboard data
curl https://nexum-obscura-backend.onrender.com/api/dashboard
```

### Frontend Test:
Open: `https://nexum-obscura-frontend.vercel.app`

## 🆘 Emergency Troubleshooting

### ❌ If Backend Fails:
1. Check Render logs for errors
2. Verify MongoDB connection string
3. Ensure all environment variables are set

### ❌ If Frontend Shows "Disconnected":
1. Update `REACT_APP_API_URL` in Vercel
2. Check backend URL is correct
3. Test backend health endpoint directly

### ❌ If Database Fails:
1. Check MongoDB Atlas network access
2. Verify connection string format
3. Test with MongoDB Compass

## 📞 Support Links

- **MongoDB Atlas**: https://cloud.mongodb.com
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/iSamarthDubey/nexum-obscura

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied and updated
- [ ] Render backend service deployed
- [ ] Backend environment variables set
- [ ] Backend health check passing
- [ ] Vercel frontend deployed
- [ ] Frontend environment variables set
- [ ] Frontend loading and showing "Connected"
- [ ] Test file upload works
- [ ] All dashboard features functional

**🎉 When all checkboxes are ✅, your platform is LIVE!**
