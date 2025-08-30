#!/bin/bash

echo "🚀 Nexum Obscura Deployment Script"
echo "================================="

# Check if git repository is clean
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "📝 Committing changes..."
    git add .
    git commit -m "Prepare for deployment - $(date)"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🔧 Next Steps:"
echo "1. Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect GitHub repo: iSamarthDubey/nexum-obscura"
echo "   - Set Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Add Environment Variable: NODE_ENV=production"
echo ""
echo "2. Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import GitHub repo: iSamarthDubey/nexum-obscura"
echo "   - Set Root Directory: frontend"
echo "   - Framework: Create React App"
echo "   - Environment Variables will be auto-configured"
echo ""
echo "🌐 Expected URLs:"
echo "   Backend:  https://nexum-obscura-backend.onrender.com"
echo "   Frontend: https://nexum-obscura-frontend.vercel.app"
echo ""
echo "🎉 Deployment preparation complete!"
