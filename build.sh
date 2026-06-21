#!/usr/bin/env bash

# Exit on error
set -o errexit

# Build Frontend
echo "Building Frontend React App..."
cd frontend
npm install
npm run build
cd ..

# Move the built dist folder to backend/static
echo "Bundling Frontend into Backend..."
rm -rf backend/static
mv frontend/dist backend/static

# Install Backend Dependencies
echo "Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt
pip install uvicorn
