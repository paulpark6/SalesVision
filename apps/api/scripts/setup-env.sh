#!/bin/bash

# Sales Vision - Environment Setup Helper
# This script helps you switch between different database configurations

set -e

ENV_DIR="$(cd "$(dirname "$0")" && pwd)"
API_DIR="$ENV_DIR/.."

echo "🚀 Sales Vision Environment Switcher"
echo "===================================="
echo ""
echo "Current environment files in apps/api:"
ls -la "$API_DIR/.env"* 2>/dev/null || echo "No .env files found"
echo ""
echo "Select environment:"
echo "1) Local Development (local PostgreSQL)"
echo "2) Cloud Development (Cloud SQL dev database)"
echo "3) Show current configuration"
echo "4) Exit"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo "Setting up LOCAL DEVELOPMENT environment..."
        if [ ! -f "$API_DIR/.env.example" ]; then
            echo "Error: .env.example not found"
            exit 1
        fi
        cp "$API_DIR/.env.example" "$API_DIR/.env"
        echo "✅ Copied .env.example to .env"
        echo ""
        echo "⚠️  Make sure local PostgreSQL is running:"
        echo "   docker-compose up db -d"
        echo ""
        echo "Or check if it's already running:"
        echo "   lsof -ti:5432"
        ;;
    2)
        echo "Setting up CLOUD DEVELOPMENT environment..."
        if [ ! -f "$API_DIR/.env.cloud-dev.example" ]; then
            echo "Error: .env.cloud-dev.example not found"
            exit 1
        fi
        cp "$API_DIR/.env.cloud-dev.example" "$API_DIR/.env"
        echo "✅ Copied .env.cloud-dev.example to .env"
        echo ""
        echo "⚠️  You need to:"
        echo "   1. Update DATABASE_URL password in .env"
        echo "   2. Run Cloud SQL Proxy on port 5433:"
        echo "      ./apps/api/cloud-sql-proxy youngintlsaleswebapp:us-central1:sales-vision-db --port 5433"
        ;;
    3)
        echo "Current .env configuration:"
        if [ -f "$API_DIR/.env" ]; then
            cat "$API_DIR/.env"
        else
            echo "No .env file found"
        fi
        ;;
    4)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Done!"
