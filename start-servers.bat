@echo off
echo Starting Legalo CMS Servers...
echo.

:: Start Backend
echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd backend && npm run dev:stable"

:: Wait a bit for backend to start
timeout /t 5 /nobreak > nul

:: Start Frontend
echo Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k "cd app && npm run dev"

echo.
echo Both servers are starting...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo Admin: http://localhost:5173/admin/login
echo.
echo Press any key to close this window...
pause > nul
