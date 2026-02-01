#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET=$(realpath "$SCRIPT_DIR/../nginx/prod.conf")
sudo ln -s "$TARGET" /etc/nginx/nginx.conf