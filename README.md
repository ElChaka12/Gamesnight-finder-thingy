# Gamesnight Finder

Gamesnight Finder is a full-stack starter project for a website where college students can find or host board-game and social game sessions on campus.

This repository uses:

- `frontend/`: Next.js 16, React 19, TypeScript
- `backend/`: Django 5.2, Django REST Framework
- `database`: SQLite for local development

The project already includes:

- A styled landing page for students
- A Django admin panel
- A `GameNight` model and seeded demo events
- A REST API the frontend can read from
- Basic tests for the backend

## Project Structure

```text
Gamesnight-finder-thingy/
|-- backend/                 Django project
|   |-- config/              Django settings and root URLs
|   |-- events/              Game-night app
|   |-- .env.example         Example backend environment file
|   `-- manage.py
|-- frontend/                Next.js app
|   |-- app/                 App Router pages and global styles
|   |-- lib/                 API helpers
|   |-- .env.local.example   Example frontend environment file
|   `-- package.json
|-- requirements.txt         Python dependencies
`-- README.md
```

## How The App Works

The backend stores and serves game-night data.

- Django admin lives at `/admin/`
- API routes live under `/api/`
- Demo data is inserted when you run migrations

The frontend displays game nights for students.

- It fetches data from the Django API
- The API base URL is controlled by `frontend/.env.local`
- If the backend is not running, the frontend falls back to local preview data so the page still loads

## Main URLs

When both servers are running locally:

- Frontend: [http://127.0.0.1:3000](http://127.0.0.1:3000)
- Django admin: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
- API health check: [http://127.0.0.1:8000/api/health/](http://127.0.0.1:8000/api/health/)
- Game nights API: [http://127.0.0.1:8000/api/game-nights/](http://127.0.0.1:8000/api/game-nights/)

## Requirements

Install these first:

- Python 3.14 or newer
- Node.js 24 or newer
- npm

This project was set up on Windows PowerShell. If PowerShell blocks the `npm` command because of execution policy, use `npm.cmd` instead.

## First-Time Setup

These are the steps to do once after opening or cloning the repository.

### 1. Install Backend Dependencies

From the repository root:

```powershell
py -m pip install -r requirements.txt
```

Optional but recommended: use a virtual environment.

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

```powershell
cd frontend
npm.cmd install
cd ..
```

### 3. Create The Frontend Environment File

The frontend does read `.env.local`, so create that file:

```powershell
Copy-Item frontend\.env.local.example frontend\.env.local
```

For the backend, local defaults are already built in, so you do not need a `.env` file to run the project locally. The file `backend/.env.example` is there as a reference for values you may want to export later in your shell or use when you add dotenv support.

### 4. Apply Database Migrations

This creates the SQLite database and loads the demo game-night records.

```powershell
cd backend
py manage.py migrate
cd ..
```

### 5. Create An Admin User

Do this if you want to log into Django admin and add or edit game nights.

```powershell
cd backend
py manage.py createsuperuser
cd ..
```

## How To Run The Program

You need two terminals: one for Django and one for Next.js.

### Terminal 1: Run The Django Backend

```powershell
cd backend
py manage.py runserver
```

What this does:

- Starts Django on `http://127.0.0.1:8000`
- Serves the admin panel
- Serves the REST API

### Terminal 2: Run The Next.js Frontend

```powershell
cd frontend
npm.cmd run dev
```

What this does:

- Starts the frontend on `http://127.0.0.1:3000`
- Loads live data from the Django backend if it is available

### Open The Site

Open:

- [http://127.0.0.1:3000](http://127.0.0.1:3000) to see the student-facing site
- [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) to manage events in admin

## Backend Commands

Useful Django commands:

```powershell
cd backend
py manage.py runserver
py manage.py migrate
py manage.py makemigrations
py manage.py createsuperuser
py manage.py test
```

## Frontend Commands

Useful Next.js commands:

```powershell
cd frontend
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
npm.cmd run start
```

## Environment Variables

### Backend

The reference file is `backend/.env.example`.

Variables:

- `DJANGO_SECRET_KEY`: Django secret key
- `DJANGO_DEBUG`: `true` or `false`
- `DJANGO_ALLOWED_HOSTS`: comma-separated allowed hosts
- `DJANGO_TIME_ZONE`: app time zone

Important:

- Django already has safe local development defaults in `settings.py`
- The backend does not currently auto-load a `.env` file
- If you want to override these values now, set them in your shell before running Django

### Frontend

The example file is `frontend/.env.local.example`.

Variables:

- `API_BASE_URL`: the URL the frontend uses to reach Django

Default local value:

```text
http://127.0.0.1:8000/api
```

## API Overview

Current API routes:

- `GET /api/health/`
- `GET /api/game-nights/`

Supported filters on `/api/game-nights/`:

- `?campus=Main`
- `?skill_level=beginner`
- `?featured=true`

Example:

```text
http://127.0.0.1:8000/api/game-nights/?featured=true
```

## Admin Workflow

If you want to manage events manually:

1. Run the backend.
2. Go to [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/).
3. Log in with the superuser you created.
4. Open the `Game Nights` section.
5. Add, edit, or remove records.

## Verification

These commands check that the project is working:

Backend tests:

```powershell
cd backend
py manage.py test
```

Frontend lint:

```powershell
cd frontend
npm.cmd run lint
```

Frontend production build:

```powershell
cd frontend
npm.cmd run build
```

## Common Problems

### PowerShell says `npm` cannot be loaded

Use:

```powershell
npm.cmd install
npm.cmd run dev
```

instead of `npm install` or `npm run dev`.

### Frontend shows preview data instead of live API data

Usually this means Django is not running or `API_BASE_URL` is incorrect.

Check:

- `backend` server is running on port `8000`
- `frontend/.env.local` contains `http://127.0.0.1:8000/api`

### Admin page opens but you cannot log in

Create a superuser:

```powershell
cd backend
py manage.py createsuperuser
```

### Database changes are not appearing

Run migrations again:

```powershell
cd backend
py manage.py makemigrations
py manage.py migrate
```

## What To Build Next

Good next features for this project:

1. Student authentication and profiles
2. Host-only event creation from the frontend
3. RSVP and seat booking
4. Campus, date, and game filters
5. Search
6. Image uploads for events
7. Postgres for production deployment
8. Deployment for frontend and backend

## Quick Start Summary

If you just want the shortest path to running it:

```powershell
py -m pip install -r requirements.txt
cd backend
py manage.py migrate
py manage.py createsuperuser
py manage.py runserver
```

In a second terminal:

```powershell
cd frontend
npm.cmd install
Copy-Item .env.local.example .env.local
npm.cmd run dev
```

Then open [http://127.0.0.1:3000](http://127.0.0.1:3000).
