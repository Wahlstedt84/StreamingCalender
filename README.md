# Streaming Calendar

A personal streaming tracker — search for movies and TV shows, save them to your list, and view upcoming releases in a calendar view. Powered by the TMDB API.

## Features

- User authentication (register / login)
- Search movies and TV shows via TMDB
- Save titles to a personal watchlist
- Calendar view of upcoming release dates
- Streaming provider info per title
- Docker support for easy self-hosting

## Tech Stack

**Frontend**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/) via `better-sqlite3`
- JWT authentication
- [TMDB API](https://www.themoviedb.org/documentation/api)

## Getting Started

### With Docker (recommended)

```bash
cp .env.example .env
# Add your TMDB API key to .env
docker compose up
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001

### Without Docker

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Configuration

Copy `.env.example` to `.env` and fill in your values:

| Variable | Description |
|---|---|
| `TMDB_API_KEY` | Your TMDB API key — get one at [themoviedb.org](https://www.themoviedb.org/settings/api) |
| `WATCH_PROVIDER_COUNTRY` | Two-letter country code for streaming providers (e.g. `SE`, `US`) |
