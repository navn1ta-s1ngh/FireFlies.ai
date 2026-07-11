# FireFlies.ai 

A meeting notes and transcription platform inspired by Fireflies.ai. It stores meeting recordings' transcripts, auto-generates summaries and topic breakdowns, tracks action items, and surfaces speaker-level insights — with a FastAPI backend and a Next.js frontend.

## Features

- AI-powered meeting dashboard
- Interactive transcript viewer
- Speaker-wise transcript
- AI-generated summaries
- Action item extraction
- Topic segmentation
- Search meetings
- Meeting CRUD
- REST APIs

## Architecture Overview

The project is a monorepo split into two independently deployable apps:

```
┌─────────────────────┐        HTTP / JSON        ┌──────────────────────┐
│   frontend (Next.js) │ ─────────────────────────▶│  backend (FastAPI)    │
│   - App Router pages │◀───────────────────────── │  - REST routers       │
│   - React Query      │                            │  - CRUD layer         │
│   - axios API client │                            │  - SQLAlchemy models  │
└─────────────────────┘                            └──────────┬───────────┘
                                                                │
                                                                ▼
                                                     ┌──────────────────────┐
                                                     │  SQL database         │
                                                     │  (SQLite by default,  │
                                                     │   Postgres-ready)     │
                                                     └──────────────────────┘
```

**Backend (`/backend`)** — FastAPI application organized in layers:
- `app/` — app factory (`main.py`), DB engine/session setup and `Base` declarative class (`database.py`)
- `models/` — SQLAlchemy ORM models (one table per domain entity)
- `schemas/` — Pydantic request/response models used for validation and serialization
- `crud/` — database access functions used by routers (create/read/update/delete)
- `routers/` — FastAPI `APIRouter`s that define the HTTP endpoints
- `services/` — business logic that doesn't belong in CRUD (e.g. computing meeting insights)
- `alembic/` — database migrations
- `seed/` — script to populate the database with sample data
- `tests/` — Pytest test suite

On startup, `init_db()` imports all models and calls `Base.metadata.create_all()`, so a fresh SQLite database is created automatically the first time the app runs. Alembic migrations are available for environments (like Postgres) where you want versioned schema changes instead.

**Frontend (`/frontend`)** — Next.js (App Router) application:
- `app/` — routes: home, login, meetings list, meeting detail (`meeting/[id]`, `meetings/[id]`), catch-all (`[slug]`)
- `services/` — `axios`-based API client (`api.ts`) and a typed `meetingService` wrapper around backend endpoints
- `components/`, `hooks/`, `lib/`, `types/` — UI components, custom hooks, utilities, and shared TypeScript types
- Data fetching/caching is handled with `@tanstack/react-query`; forms use `react-hook-form` + `zod`

The two apps communicate purely over HTTP: the frontend reads `NEXT_PUBLIC_API_URL` to know where the backend lives, and the backend reads `FRONTEND_ORIGIN` / `DEPLOYED_FRONTEND_ORIGIN` to configure CORS.

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Backend    | Python, FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic, Uvicorn |
| Database   | SQLite (default, local dev) — swappable via `DATABASE_URL` (e.g. PostgreSQL) |
| Frontend   | Next.js 15, React 19, TypeScript, Tailwind CSS, React Query, axios, React Hook Form, Zod |
| Testing    | Pytest (backend) |

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm

### 1. Clone the repo

```bash
git clone https://github.com/navn1ta-s1ngh/FireFlies.ai.git
cd FireFlies.ai
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env            # then edit values as needed
```

`.env` variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLAlchemy connection string | `sqlite:///./fireflies.db` |
| `FRONTEND_ORIGIN` | Allowed CORS origin for local frontend | `http://localhost:3000` |

Run database migrations (optional — tables are also auto-created on app startup):

```bash
alembic upgrade head
```

(Optional) seed the database with sample data:

```bash
python -m seed.seed_data
```

Start the API server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs` and a health check at `http://localhost:8000/health`.

Run the test suite:

```bash
pytest
```

### 3. Frontend setup

```bash
cd frontend
npm install

cp .env.example .env.local      # then edit values as needed
```

`.env.local` variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (e.g. `http://localhost:8000`) |

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

Other useful scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint the codebase
```

### 4. Run both together

With the backend running on port 8000 and `NEXT_PUBLIC_API_URL=http://localhost:8000` set in the frontend, start both dev servers in separate terminals and open `http://localhost:3000`.

## Database Schema

The schema is defined with SQLAlchemy models under `backend/models/`. Core entities and relationships:

- **`users`** — application users (`id`, `name`, `email`, `created_at`).
- **`meetings`** — the central entity (`id`, `title`, `date`, `duration_seconds`, `audio_url`, `status`, `created_at`, `updated_at`).
- **`participants`** — people who attend meetings (`id`, `name`, `email`), linked to meetings via the `meeting_participants` many-to-many join table.
- **`transcript_segments`** — timestamped lines of transcript text (`id`, `meeting_id`, `speaker_name`, `start_time_seconds`, `end_time_seconds`, `text`, `order_index`), each belonging to one meeting.
- **`topics`** — chapter/topic markers within a meeting (`id`, `meeting_id`, `title`, `start_time_seconds`, `order_index`).
- **`summaries`** — one-to-one AI-generated overview per meeting (`id`, `meeting_id` (unique), `overview_text`, `generated_at`).
- **`action_items`** — follow-up tasks extracted from a meeting (`id`, `meeting_id`, `text`, `assignee`, `completed`, `created_at`).

### Entity-Relationship Summary

```
users                (standalone)

meetings 1 ──── * transcript_segments
meetings 1 ──── * topics
meetings 1 ──── 1 summary
meetings 1 ──── * action_items
meetings * ──── * participants   (via meeting_participants join table)
```

All child tables use `ON DELETE CASCADE` on their `meeting_id` foreign key, so deleting a meeting removes its transcript segments, topics, summary, and action items automatically.

> Note: `backend/alembic/versions/0001_initial.py` contains the initial migration. If you add or change models, generate a new revision with `alembic revision --autogenerate -m "<message>"` and apply it with `alembic upgrade head`.

## API Overview

Base URL: `http://localhost:8000` (configurable via `NEXT_PUBLIC_API_URL` on the frontend). Full interactive documentation is auto-generated by FastAPI at `/docs` (Swagger UI) and `/redoc`.

### System

| Method | Path | Description |
|--------|------|--------------|
| GET | `/health` | Health check |

### Meetings

| Method | Path | Description |
|--------|------|--------------|
| GET | `/meetings` | List meetings (supports `search`, `participant`, `sort` query params) |
| POST | `/meetings` | Create a meeting |
| GET | `/meetings/{meeting_id}` | Get full meeting detail (transcript, summary, topics, action items) |
| PATCH | `/meetings/{meeting_id}` | Update a meeting |
| DELETE | `/meetings/{meeting_id}` | Delete a meeting (cascades to its child records) |
| POST | `/meetings/upload` | Upload a transcript file (`.json` or plain text) and create/append to a meeting |

### Transcript

| Method | Path | Description |
|--------|------|--------------|
| GET | `/meetings/{meeting_id}/transcript` | Get all transcript segments for a meeting |
| GET | `/meetings/{meeting_id}/transcript/search?q=` | Search transcript text within a meeting |

### Summary

| Method | Path | Description |
|--------|------|--------------|
| GET | `/meetings/{meeting_id}/summary` | Get the AI-generated summary for a meeting |

### Action Items / Tasks

| Method | Path | Description |
|--------|------|--------------|
| GET | `/meetings/{meeting_id}/action-items` | List action items for a meeting |
| POST | `/meetings/{meeting_id}/action-items` | Create an action item on a meeting |
| POST | `/meetings/{meeting_id}/tasks` | Create a task (alias of action items) on a meeting |
| PUT | `/tasks/{task_id}` | Update a task |
| DELETE | `/tasks/{task_id}` | Delete a task |
| PATCH | `/action-items/{action_item_id}` | Update an action item |
| DELETE | `/action-items/{action_item_id}` | Delete an action item |

### Insights

| Method | Path | Description |
|--------|------|--------------|
| GET | `/meetings/{meeting_id}/insights` | Speaker talk-time ratios, line/word counts, and action item completion stats for a meeting |

### Search

| Method | Path | Description |
|--------|------|--------------|
| GET | `/search?q=&limit=` | Global search across meetings/transcripts (limit defaults to 10, max 25) |

All request/response bodies are validated with Pydantic schemas in `backend/schemas/`. Errors follow FastAPI's standard `{"detail": "..."}` format with appropriate HTTP status codes (404 for missing resources, 201 for creation, 204 for deletion, etc.).

## Project Structure

```
FireFlies.ai/
├── backend/
│   ├── app/            # app factory, DB session/engine
│   ├── models/         # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── crud/            # DB access functions
│   ├── routers/          # FastAPI route definitions
│   ├── services/         # business logic (e.g. insights)
│   ├── alembic/           # DB migrations
│   ├── seed/              # sample data seeding script
│   ├── tests/              # Pytest tests
│   └── requirements.txt
└── frontend/
    ├── app/              # Next.js App Router pages
    ├── components/       # UI components
    ├── hooks/            # custom React hooks
    ├── lib/               # utilities
    ├── services/           # API client + typed service wrappers
    ├── types/               # shared TypeScript types
    └── package.json
```

## Contributing

1. Fork the repo and create a feature branch.
2. Make your changes, adding/updating tests as needed.
3. Run `pytest` (backend) and `npm run lint` (frontend) before opening a PR.
