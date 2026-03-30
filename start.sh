#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
CLIENT_DIR="$ROOT/client"
SERVER_DIR="$ROOT/server"

# Install dependencies if needed
if [ ! -d "$CLIENT_DIR/node_modules" ]; then
    echo "Installing client dependencies..."
    npm install --prefix "$CLIENT_DIR"
fi

if [ ! -d "$SERVER_DIR/node_modules" ]; then
    echo "Installing server dependencies..."
    npm install --prefix "$SERVER_DIR"
fi

# Build client
echo "Building client..."
npm run build --prefix "$CLIENT_DIR"

# Copy client dist to server public
echo "Copying client build to server/public..."
rm -rf "$SERVER_DIR/public"
cp -r "$CLIENT_DIR/dist" "$SERVER_DIR/public"

# Start server with minimal env vars for local dev
echo "Starting server on http://localhost:8000"
cd "$SERVER_DIR"
EXPRESS_PORT=8000 \
DB_ISLOCAL=1 \
DB_LOG=0 \
SESSION_SECRET=localsecret \
APISOCKET_KEY=localkey \
IP_HASH_SALT=localsalt \
node src/index.js
