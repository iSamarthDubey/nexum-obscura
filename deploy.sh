#!/bin/bash
# Nexum Obscura Quick Deployment Script

echo "🚀 Nexum Obscura Deployment Setup"
echo "=================================="

# Copy shared data to backend for deployment
echo "📂 Copying shared data to backend..."
mkdir -p nexum-obscura/backend/shared
cp nexum-obscura/shared/*.csv nexum-obscura/backend/shared/

# Add all changes to git
echo "📝 Adding changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: Add shared data and deployment configuration"

# Push to GitHub
echo "🔄 Pushing to GitHub..."
git push origin main

echo "✅ Deployment setup complete!"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Render: https://render.com"
echo "2. Deploy frontend to Vercel: https://vercel.com"
echo "3. Set environment variables as per DEPLOYMENT.md"
echo "4. Test the deployed application"
