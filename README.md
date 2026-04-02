# Website Navigator (MERN)

Upload an Excel/CSV file (or import a public Google Sheet) containing website URLs, then navigate them with Previous/Next buttons inside the app.

## Features

- Upload `.xlsx`, `.xls`, `.csv`
- Import public Google Sheet (CSV export)
- Extract & normalize URLs, remove duplicates
- Website viewer (iframe) + “Open in new tab”
- Previous/Next navigation + list sidebar
- Responsive UI

## Tech

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: Not required (optional)

## Quick Start

**Requirements:** Node.js 18+ (backend uses built-in `fetch`).

### 1) Install

```bash
npm install
```

If PowerShell blocks `npm` with an execution policy error, use:

```bash
npm.cmd install
```

### 2) Run (dev)

```bash
npm run dev
```

PowerShell fallback:

```bash
npm.cmd run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:5050`

## Sample File

Try `sample/urls.csv`.

## Deployment (Render + Vercel)

Yes — deploy backend to Render and frontend to Vercel.

### Backend on Render

- Create a **Web Service** from this repo
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment:
  - `CORS_ORIGIN` = your Vercel URL(s) (comma-separated), e.g. `https://your-app.vercel.app`

After deploy, note your Render URL (example): `https://your-service.onrender.com`

### Frontend on Vercel

- Import the repo into Vercel
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment:
  - `VITE_API_BASE_URL` = your Render backend URL, e.g. `https://your-service.onrender.com`

Redeploy the Vercel project after setting env vars.

## Importing a Google Sheet

This app supports **public** sheets via CSV export.

Recommended: use an export URL like:

```
https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=<GID>
```

You can also paste a normal “Share” URL — the backend will try to convert it to a CSV export link.

## File Format Tips

- Put URLs in any column (the parser scans all cells).
- Examples: `https://example.com`, `http://example.com`, `www.example.com`

## Screenshots & Demo Video (Submission)

- Screenshots: capture the Import screen and the Navigator screen.
- Demo video (2–5 min): show upload/import, URL list, Previous/Next navigation, and “Open in new tab”.

## Project Structure

- `server/` Express API (parsing)
- `client/` React UI
