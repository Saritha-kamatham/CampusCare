#!/usr/bin/env bash
echo "==================================================================="
echo "  CampusCare - Smart Campus Service & Issue Management Platform"
echo "==================================================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

echo "[1/2] Starting Spring Boot Backend (Port 8080)..."
(cd "$ROOT_DIR/backend" && mvn spring-boot:run -Dspring-boot.run.profiles=h2) &
BACKEND_PID=$!

sleep 5

echo "[2/2] Starting React Vite Frontend (Port 5173)..."
(cd "$ROOT_DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT SIGTERM EXIT

wait
