#!/bin/bash
# Deployment Environment Check

echo "🔍 VERCEL DEPLOYMENT ENVIRONMENT CHECK"
echo "======================================"

echo ""
echo "🎯 Expected Configuration:"
echo "- Local Frontend: http://localhost:3000"
echo "- Local Backend: http://localhost:5000/api"
echo "- Production Frontend: https://obscura-collective.vercel.app"
echo "- Production Backend: https://nexum-obscura.onrender.com/api"

echo ""
echo "❌ CURRENT ISSUE:"
echo "Vercel frontend is connecting to localhost:5000 instead of Render backend"

echo ""
echo "✅ SOLUTION STEPS:"
echo "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
echo "2. Add: REACT_APP_API_URL = https://nexum-obscura.onrender.com/api"
echo "3. Set for: Production (and optionally Preview)"
echo "4. Redeploy the frontend"

echo ""
echo "🔧 MANUAL FIX:"
echo "If the above doesn't work, check browser dev tools on your Vercel site:"
echo "1. Open https://obscura-collective.vercel.app"
echo "2. Open Developer Tools → Network tab"
echo "3. Check if API calls go to 'nexum-obscura.onrender.com' or 'localhost:5000'"
echo "4. If localhost:5000, the environment variable isn't set properly"

echo ""
echo "🚨 IMPORTANT:"
echo "Environment variables in vercel.json are DEPRECATED"
echo "Use Vercel Dashboard Environment Variables instead"

echo ""
echo "✅ After fix, your architecture should be:"
echo "User → Vercel Frontend → Render Backend → MongoDB Atlas"
