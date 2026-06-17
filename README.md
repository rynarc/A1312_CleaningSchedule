# A1312 Duty Schedule

Weekly cleaning duty rotation web app for a shared workspace, built with React and a lightweight Express API. Auto-rotates the 5-slot schedule every week and lets admins make one-time overrides for a specific date without breaking the main rotation.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/license-MIT-green)

## Preview

![App Preview](docs/images/preview.png)

## Features

- **Auto-rotation** — displays who's on duty this Sunday based on a 5-slot weekly cycle (no manual tracking needed).
- **Hero card** — highlights the current week's pair front and center; shows the upcoming pair if checked before Sunday.
- **Override for a specific date** — change who's on duty for one week without touching the regular rotation; a reset button reverts it.
- **Password-protected editing** — a modal prompts for an admin password before any edit is allowed.
- **Full rotation table** — shows all 5 slots with the active slot highlighted.
- **Next 4 weeks view** — upcoming duty pairs with per-week edit/reset controls.

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite 5 |
| Backend | Node.js, Express 4 |
| Deployment | Vercel (frontend), backend on separate Node host |

## Project Structure

```
A1312CleanSchedule/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx  # main UI (schedule display + edit flow)
│   │   └── App.css
│   └── vercel.json  # Vercel build config
└── server/          # Express API
    └── server.js    # /api/schedule and /api/override endpoints
```

## Running Locally

```sh
# Backend
cd server
npm install
npm run dev          # starts on :3001 (or PORT env)

# Frontend
cd client
npm install
npm run dev          # starts on :5173
```

## Author

**Ryan Aric Ardhani**
