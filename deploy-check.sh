#!/bin/bash
# Quick deployment configuration script for Nexum Obscura

echo "🚀 Nexum Obscura Deployment Configuration"
echo "==========================================="

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the nexum-obscura root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Backend deployment check
echo ""
echo "🔧 Backend Configuration:"
echo "- Entry point: backend/minimal.js"
echo "- Start command: npm start"
echo "- Health check: /api/health"

if [ -f "backend/.env" ]; then
    echo "✅ Backend .env file exists"
else
    echo "⚠️  Backend .env file missing - create it with MongoDB connection string"
fi

# Frontend deployment check
echo ""
echo "🎨 Frontend Configuration:"
echo "- Build command: npm run build"
echo "- Output directory: build/"
echo "- Framework: Create React App"

if [ -f "frontend/vercel.json" ]; then
    echo "✅ Vercel configuration file exists"
else
    echo "❌ Vercel configuration missing"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Deploy backend to Render with root directory: backend"
echo "2. Copy your Render backend URL"
echo "3. Update Vercel environment variable: REACT_APP_API_URL"
echo "4. Deploy frontend to Vercel with root directory: frontend"
echo ""
echo "🎯 Your app will be live at:"
echo "- Backend: https://YOUR-APP.onrender.com"
echo "- Frontend: https://YOUR-APP.vercel.app"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
