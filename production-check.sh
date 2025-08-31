#!/bin/bash
# Production deployment verification script

echo "🚀 Nexum Obscura - Production Deployment Check"
echo "=============================================="

echo ""
echo "🔍 Checking hardcoded localhost references..."

# Check for hardcoded localhost URLs in frontend
echo "Frontend files with localhost references:"
grep -r "localhost:5000\|localhost:3000" frontend/src/ --include="*.js" --include="*.jsx" | wc -l

# Show specific files if any found
grep -r "localhost:5000\|localhost:3000" frontend/src/ --include="*.js" --include="*.jsx" || echo "✅ No hardcoded localhost URLs found!"

echo ""
echo "🌐 Backend CORS Configuration:"
echo "Current allowed origins:"
grep -A 10 "origin: \[" backend/minimal.js

echo ""
echo "🔧 Environment Variables Check:"
echo "Frontend .env.production:"
cat frontend/.env.production

echo ""
echo "📋 Deployment URLs:"
echo "Frontend: https://obscura-collective.vercel.app/"
echo "Backend:  https://nexum-obscura.onrender.com"
echo "Health:   https://nexum-obscura.onrender.com/api/health"

echo ""
echo "🎯 Next Steps:"
echo "1. Push changes to GitHub"
echo "2. Redeploy backend on Render"
echo "3. Redeploy frontend on Vercel"
echo "4. Test the health endpoint"
echo "5. Verify frontend connects to backend"
