@echo off
echo.
echo ================================
echo   NEXUM OBSCURA DEPLOYMENT
echo ================================
echo.

echo [1/5] Checking project structure...
if not exist "backend" (
    echo ERROR: backend folder not found
    pause
    exit /b 1
)
if not exist "frontend" (
    echo ERROR: frontend folder not found  
    pause
    exit /b 1
)
echo ✅ Project structure OK

echo.
echo [2/5] Checking backend configuration...
if not exist "backend\.env" (
    echo ERROR: backend\.env file missing
    pause
    exit /b 1
)
if not exist "backend\render.yaml" (
    echo ERROR: backend\render.yaml file missing
    pause
    exit /b 1
)
echo ✅ Backend config OK

echo.
echo [3/5] Checking frontend configuration...
if not exist "frontend\.env.production" (
    echo ERROR: frontend\.env.production file missing
    pause
    exit /b 1
)
if not exist "frontend\vercel.json" (
    echo ERROR: frontend\vercel.json file missing
    pause
    exit /b 1
)
echo ✅ Frontend config OK

echo.
echo [4/5] Ready for deployment!
echo.
echo NEXT STEPS:
echo 1. Deploy backend to Render (see PRODUCTION_DEPLOYMENT.md)
echo 2. Copy your backend URL
echo 3. Update frontend\.env.production with your backend URL
echo 4. Deploy frontend to Vercel
echo.

echo [5/5] Deployment URLs:
echo Backend:  https://YOUR-APP.onrender.com
echo Frontend: https://YOUR-APP.vercel.app
echo Health:   https://YOUR-APP.onrender.com/api/health
echo.

echo ================================
echo Ready to deploy! Check the guide:
echo PRODUCTION_DEPLOYMENT.md
echo ================================
pause
