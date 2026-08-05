# Modules Management System

A minimalist, highly responsive system registry built with **React (Bootstrap 5)** on the frontend and an **Express.js & SQLite3** database backend.

---

## Features

- **Modules List**: Dynamic table with action buttons and filter telemetry displays.
- **Filter Panel**: Local input offcanvas drawer filtering by category, tag, collaborator, and date.
- **Module Details**: Single item metric layout cards.
- **Form Management**: Add and Edit views with validations.
- **SQLite DB Persistence**: Automated schema creation and mock seeding.
- **Concurrent Execution**: Launches client and server concurrently using a single CLI command.

---

## Setup & Running Instructions

### 1. Install Dependencies
Run the installation command inside the project root:
```bash
npm install
```

### 2. Run in Development Mode
To boot both the Express API server (port 3001) and Vite frontend server (port 5174) concurrently inside the same terminal shell, run:
```bash
npm run dev
```

Open [http://localhost:5174/](http://localhost:5174/) (or the port specified by Vite) in your browser.

---

## Directory Structure

```
task/
├── backend/            # Express backend & SQLite schema helper
│   ├── db.js
│   └── index.js
├── src/                # Frontend application
│   ├── components/     # Navbar and FilterPanel layout items
│   ├── pages/          # ModuleList, ModuleView, and ModuleForm views
│   ├── App.jsx         # View router and state coordinator
│   └── main.jsx        # App entry point
├── package.json
└── vite.config.js      # API Proxy setup mapping /api -> port 3001
```
