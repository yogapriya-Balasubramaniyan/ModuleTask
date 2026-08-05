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

## Setup & Local Running Instructions

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/yogapriya-Balasubramaniyan/ModuleTask.git
cd ModuleTask
```

### 2. Install Dependencies
Install all required package packages for both backend and frontend:
```bash
npm install
```

### 3. Start the Application
Run the concurrent dev command:
```bash
npm run dev
```
This single command automatically starts:
- The **Express API server** on port `3001`
- The **Vite + React development server** on port `5174` (or next available port)
- The **SQLite database initialization & mock seeding** inside `backend/modules.db`

### 4. Access in Browser
Once running, open your browser and navigate to:
👉 **[http://localhost:5174/](http://localhost:5174/)** (or the port shown in your terminal logs)

### 5. Access Credentials
To sign in to the dashboard, use the default administrator credentials:
- **Username**: `admin`
- **Password**: `admin123`

---

## Directory Structure

```
task/
├── backend/            # Express backend & SQLite schema helper
│   ├── db.js
│   └── index.js
├── src/                # Frontend application
│   ├── components/     # Navbar and FilterPanel layout items
│   ├── pages/          # Login, ModuleList, ModuleView, and ModuleForm views
│   ├── App.jsx         # View router and state coordinator
│   └── main.jsx        # App entry point
├── package.json
└── vite.config.js      # API Proxy setup mapping /api -> port 3001
```
