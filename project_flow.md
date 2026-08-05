# Project Flow: Modules Management System

This document outlines the architectural structure, database schemas, and request flow for the Modules Management System.

---

## 1. Directory Structure

The application separates frontend and backend code into dedicated flat layouts:

```
task/
├── backend/            # Dedicated Backend Folder
│   ├── db.js           # SQLite connection, table schema, and mock seed data
│   └── index.js        # Express server and endpoints (/modules)
├── src/                # Dedicated Frontend Folder
│   ├── components/     # Reusable layout elements (imported directly by file name)
│   │   ├── Navbar.jsx  # Page header branding navbar
│   │   └── FilterPanel.jsx # Slide-out filter panel drawer (manages inputs locally)
│   ├── pages/          # Full page view components (fetching internally, imported directly by file name)
│   │   ├── ModuleList.jsx  # Modules list table (fetches modules locally based on active filters)
│   │   ├── ModuleView.jsx  # Detail cards view (fetches single module internally on mount)
│   │   └── ModuleForm.jsx  # Form handling Create and Edit states (fetches / saves internally)
│   ├── App.jsx         # Root app layout router (coordinates active view navigation)
│   ├── index.css       # Core stylesheet presets
│   └── main.jsx        # Mount configuration loading Bootstrap
├── vite.config.js      # Vite dev settings mapping /api to port 3001
└── package.json        # Project metadata and start scripts
```

---

## 2. System Flow

The diagram below details the data exchange path between components. Notice that the parent `App.jsx` handles only the routing view transitions, while pages make HTTP requests independently:

```
                  [ parent App.jsx ] 
                ( Coordinates active view )
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
  [ pages/ModuleList ] [ pages/ModuleView ] [ pages/ModuleForm ]
  (Fetches list internally)  (Fetches detail internally)  (Saves data internally)
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │ ( HTTP API Requests )
                            ▼
                    [ Vite Proxy (/api) ]
                            │
                            ▼
                [ backend/index.js (3001) ]
                            │
                            ▼
                [ SQLite Database (db.js) ]
```

---

## 3. Database Schema

The SQLite database schema is defined inside `backend/db.js` as follows:

| Column Name | Data Type | Key Type | Nullable | Description |
|---|---|---|---|---|
| `id` | `INTEGER` | PRIMARY KEY (AUTOINCREMENT) | No | Unique identifier |
| `name` | `TEXT` | - | No | Name of the module |
| `description` | `TEXT` | - | Yes | Summary of the module scope |
| `category` | `TEXT` | - | No | Tagged grouping category |
| `tags` | `TEXT` | - | No | JSON array string of keywords |
| `collaborators` | `TEXT` | - | No | JSON array string of developer names |
| `createdAt` | `TEXT` | - | No | ISO Date String |
| `updatedAt` | `TEXT` | - | No | ISO Date String |

---

## 4. API Endpoint Mapping

The Express backend (`backend/index.js`) exposes the following endpoints:

### `GET /modules`
- **Description**: Returns all registered modules.
- **Parameters**: `category` (string), `tag` (string), `collaborator` (string), `date` (YYYY-MM-DD string).
- **Behavior**: Executes SQLite `LIKE` matching, parsing JSON arrays for tags and collaborators before returning.

### `POST /modules`
- **Description**: Registers a new module.
- **Body**: `{ name, description, category, tags: [], collaborators: [] }`
- **Behavior**: Validates presence of `name` and `category`. Automatically sets timestamps.

### `GET /modules/:id`
- **Description**: Returns details of a specific module.
- **Behavior**: Query by ID. Returns 404 if missing.

### `PUT /modules/:id`
- **Description**: Updates specific fields for an existing module.
- **Body**: `{ name, description, category, tags: [], collaborators: [] }`
- **Behavior**: Merges and commits field changes to the DB.

---

## 5. Verification

1. **Start Backend**: `npm run server` initializes database and starts Express on port 3001.
2. **Start Frontend**: `npm run dev` boots the Vite server, proxying client-side fetch calls from `/api/modules` directly to the backend.
