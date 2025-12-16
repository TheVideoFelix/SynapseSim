# SynapseSim

SynapseSim is a small **web-based Turing machine visualizer**.  
It uses my Python package [`tm-simulator`](https://pypi.org/project/tm-simulator/) on the backend and a TypeScript/React frontend to show the tape and head movements in the browser.

## What it does

- Loads Turing machines (and multi‑tape TMs) from `.TM` / `.MTTM` files on the server
- Exposes them via a **FastAPI** backend and **WebSocket** endpoint
- Streams each simulation step (state, tapes, head moves) to the browser

## Tech stack

- **Backend:** Python, FastAPI, WebSockets, `tm-simulator`
- **Frontend:** React, TypeScript, Vite, SCSS

## Running locally (development)

Backend:

```bash
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload
# FastAPI on http://localhost:8000
```
Frontend:
```bash
cd client
npm install
npm run dev
# React app on http://localhost:5173
```
