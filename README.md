# ProjectPool

A project discovery library for college students. Browse practical project ideas, search by topic or tool, save ideas for later, and open a project brief with suggested features and deliverables.

## Stack

- Frontend: React, Vite, Tailwind CSS, shadcn/ui conventions, Lucide
- Backend: Node.js, Express, Mongoose
- Database: MongoDB

## Run locally

1. Install dependencies from the repository root: `npm install`, `npm install --prefix frontend`, and `npm install --prefix backend`.
2. Copy `backend/.env.example` to `backend/.env`. The API targets the `ProjectPool` database and `ProjectPool` collection by default. Set `MONGODB_URI` to your local or Atlas connection string if needed; `MONGODB_DB` selects the database name.
3. Start both applications with `npm run dev`.
4. Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

The API runs at `http://localhost:5000`. Check `GET /api/health` for API and database status. Starter project data remains available when MongoDB is not connected.

## API

- `GET /api/projects` supports `category`, `difficulty`, and `q` query parameters.
- `GET /api/projects/:id` returns one project brief.
- `GET /api/health` reports API and MongoDB status.

Saved ideas currently live in browser local storage. Authentication, student-submitted ideas, and moderation are good next features once the core catalog is shaped.