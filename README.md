# Task Manager

A small but production-quality task manager. Create tasks, organize them by
category, complete them with a 5-second **undo** window, and delete them with
undo as well. Each category enforces a limit of **5 active tasks**.

- **Backend** — NestJS + TypeORM + SQLite REST API (`backend/`, port **3001**)
- **Frontend** — Next.js (App Router) + MUI + TypeScript (`frontend/`, port **3000**)

---

## Features

- List tasks, filter by category (`All` + each category).
- Add a task (React Hook Form) with required text (max 200 chars) and category.
- Per-category limit: a category may hold at most **5 active (incomplete) tasks**;
  the 6th attempt returns `400` and the form shows an inline error.
- **Complete with undo:** checking a task dims it (opacity + strikethrough) and
  shows a "Task completed" snackbar with **Undo** for 5s. Undo restores it; after
  5s with no undo the task is deleted from the backend.
- **Delete with undo:** the delete icon removes the task immediately and shows a
  "Task deleted" snackbar with **Undo** (re-creates the task via POST).
- Loading spinner, error banner, and a friendly empty state.
- Responsive down to 375px; consistent MUI design system; colored category badges.

---

## Prerequisites

- **Node.js 18+** (Node 20 LTS recommended) and npm.
- No native build tools required: the backend uses `sql.js` (a pure-JS/WASM
  SQLite build) via TypeORM's `sqljs` driver, so `npm install` works on any
  platform without a C++ toolchain.

---

## Install

From the repository root you can install both apps at once:

```bash
npm install            # installs concurrently (for the combined dev script)
npm run install:all    # installs backend + frontend dependencies
```

Or install each app individually:

```bash
cd backend  && npm install
cd frontend && npm install
```

---

## Environment variables

Copy the example files and adjust if needed (defaults work for local dev).

**backend/.env** (see `backend/.env.example`)

| Variable        | Default        | Description                                   |
| --------------- | -------------- | --------------------------------------------- |
| `PORT`          | `3001`         | Port the API listens on.                      |
| `NODE_ENV`      | `development`  | `development` enables request logging.        |
| `DATABASE_PATH` | `data.sqlite`  | SQLite file path (relative to `backend/`).    |

```bash
cd backend && cp .env.example .env
```

**frontend/.env.local** (see `frontend/.env.example`)

| Variable               | Default                 | Description                |
| ---------------------- | ----------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:3001` | Base URL of the backend.   |

```bash
cd frontend && cp .env.example .env.local
```

> The frontend falls back to `http://localhost:3001` if the var is unset, so
> local development works without creating the file.

---

## Run locally

**Option A — both at once (from the repo root):**

```bash
npm run dev
```

This starts the backend (`:3001`) and frontend (`:3000`) together via
`concurrently`. On first run the backend creates `backend/data.sqlite` and seeds
four categories (Work, Personal, Shopping, Health).

**Option B — separate terminals:**

```bash
# Terminal 1 — backend on http://localhost:3001
cd backend && npm run start:dev

# Terminal 2 — frontend on http://localhost:3000
cd frontend && npm run dev
```

Open <http://localhost:3000>.

---

## API reference

Base URL: `http://localhost:3001`

| Method   | Path                  | Body                          | Result                                                                 |
| -------- | --------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `GET`    | `/categories`         | —                             | `200` `[{ id, name }]`                                                  |
| `GET`    | `/todos?category=:id` | —                             | `200` `[{ id, text, completed, categoryId, categoryName, createdAt }]` |
| `POST`   | `/todos`              | `{ text, categoryId }`        | `201` created todo · `400 { error }` if invalid or category is full    |
| `PATCH`  | `/todos/:id`          | `{ completed: boolean }`      | `200` updated todo                                                      |
| `DELETE` | `/todos/:id`          | —                             | `204` (no body)                                                        |

All errors share the shape `{ "error": string }`.

---

## Deployment (optional bonus)

### Frontend → Vercel

1. Import the repo in Vercel and set the **Root Directory** to `frontend`.
   Next.js is auto-detected (build `next build`, output handled automatically).
2. Add the env var `NEXT_PUBLIC_API_URL` = your deployed backend URL
   (e.g. `https://task-manager-backend.onrender.com`).
3. Deploy. Vercel gives you a live URL.

### Backend → Render

A blueprint is provided at `backend/render.yaml`.

1. In Render, create a **Blueprint** and point it at this repo; it reads
   `backend/render.yaml` (build `npm install && npm run build`,
   start `node dist/main.js`).
2. Render injects `PORT` automatically. A 1GB persistent disk is mounted at
   `/data` and `DATABASE_PATH` is set to `/data/data.sqlite` so the SQLite
   database **survives redeploys**. (Without a persistent disk, SQLite data
   resets on every deploy.)
3. Once live, copy the service URL into the frontend's `NEXT_PUBLIC_API_URL`.

> **Railway alternative:** create a service from the `backend/` folder, set the
> start command to `node dist/main.js` and build to `npm run build`, attach a
> volume for the SQLite file, and Railway provides `PORT` automatically.

<!-- After deploying, add your live URLs here:
- Frontend: https://...vercel.app
- Backend:  https://...onrender.com
-->

---

## Project structure

```
.
├── backend/                 # NestJS REST API
│   ├── src/
│   │   ├── categories/       # entity, module, controller, service
│   │   ├── todos/            # entity, module, controller, service, DTOs
│   │   ├── common/           # logger middleware + global exception filter
│   │   ├── database/         # seed default categories
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── render.yaml           # Render deploy blueprint
├── frontend/                # Next.js + MUI app
│   └── src/
│       ├── app/              # layout + page (App Router)
│       ├── components/       # TodoPage, TodoList, TodoItem, AddTodoForm, ...
│       ├── context/          # SnackbarProvider (single snackbar + Undo)
│       ├── lib/              # api.ts (Axios), types, category colors
│       └── theme.ts          # MUI design system
├── package.json             # root dev scripts (concurrently)
└── README.md
```

---

## Notes

- TypeORM runs with `synchronize: true` (schema auto-created from entities),
  which is appropriate for an app this size; a larger app would use migrations.
- The category filter refetches from the API (`GET /todos?category=`) so the
  backend filter is exercised end to end.
- The snackbar auto-hide duration (5s) is intentionally equal to the task-removal
  delay, and only one snackbar is shown at a time (a new action replaces it).
