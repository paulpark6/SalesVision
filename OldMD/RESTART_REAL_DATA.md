#!/bin/bash

# RESTART_REAL_DATA.sh
# This script helps you restart both the backend and frontend to pick up 
# the new "Real Data" configuration.

 "🚀 Restarting SalesVision with Real Data configuration..."

# 1. Kill any existing next dev or uvicorn processes if they are running in the background
# (Optional - only if you want to force restart from this script)
# pkill -f "next dev"
# pkill -f "uvicorn"

 ""
 "📝 NEXT STEPS TO RUN MANUALLY:"
 "------------------------------------------------"
 "TAB 1: Cloud SQL Proxy (Already running? Keep it!)"
 "   ./apps/api/cloud-sql-proxy youngintlsaleswebapp:us-central1:sales-vision-db ..."
 ""
 "TAB 2: Backend API"
 "   cd apps/api"
 "   export APP_ENV=development"
 "   export DATABASE_URL=\"your_postgres_connection_string\""
 "   venv/bin/uvicorn app.main:app --reload --port 8000"
 ""
 "TAB 3: Frontend Web"
 "   cd apps/web"
 "   npm run dev"
 "------------------------------------------------"
 ""
 "🔍 VERIFICATION CHECKLIST:"
 "1. Open http://localhost:9002/login"
 "2. Click 'Login as Admin'"
 "3. Open Browser DevTools (F12) -> Network tab"
 "4. Look for the '/api/users/me' request"
 "5. VERIFY: No 'X-Mock-User-Email' header exists in the request."
 "6. VERIFY: The dashboard numbers match your Cloud SQL data."
 ""
 "Done! The app is now fully decoupled from mock data."
