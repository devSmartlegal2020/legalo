#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
    echo -e "\nStopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "Starting Legalo CMS Servers..."
echo ""

# Start Backend
echo "Starting Backend Server (Port 5000)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to initialize
sleep 3

# Start Frontend
echo "Starting Frontend Server (Port 5173)..."
cd app
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "Admin Panel: http://localhost:5173/admin/login"
echo ""
echo "Press Ctrl+C to stop both servers."

# Keep script running
wait
