# Vercel Deployment Configuration

## Frontend Deployment Setup

1. **Create New Project on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project"
   - Import your GitHub repository: `iSamarthDubey/nexum-obscura`

2. **Configuration Settings**

   ```bash
   Project Name: nexum-obscura-frontend
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **Environment Variables**

   ```bash
   REACT_APP_API_URL=https://nexum-obscura-backend.onrender.com
   REACT_APP_ENV=production
   ```

4. **Auto-Deploy Settings**
   - Enable automatic deployments for the `main` branch
   - Enable production deployments for `main` branch

## Expected Deployment URL
Your frontend will be available at: `https://nexum-obscura-frontend.vercel.app`

## Build Configuration
Vercel will automatically detect the React app and configure:
- Build command: `npm run build`
- Output directory: `build`
- Node.js version: Latest LTS

## Important Notes
- Update API calls to use the deployed backend URL
- Ensure CORS is configured on backend for Vercel domain
- Static files are automatically optimized by Vercel CDN
- Supports automatic HTTPS and custom domains
