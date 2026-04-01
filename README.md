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
