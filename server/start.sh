#!/bin/bash
cd "$(dirname "$0")"
echo "Python env..."
source ./venv/bin/activate
echo "Staring GastApi server"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000