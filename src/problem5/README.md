## Problem 5 – Express + SQLite CRUD Service

### Prerequisites
- Node.js 20+
- SQLite (bundled) – Prisma stores data in `prisma/dev.db` by default

### Setup
```bash
cd src/problem5
npm install
# optionally create .env with DATABASE_URL override if desired
npm run prisma:migrate # creates dev.db using Prisma + SQLite
```

Environment variables (defined in `.env` or shell):
- `PORT` (default: `4000`)
- `DATABASE_URL` (default: `file:./dev.db`)
- `API_PREFIX` (default: `/api/resources`)

### Scripts
- `npm run dev` – start dev server with reload
- `npm run build` – emit JS in `dist`
- `npm start` – run compiled server
- `npm run prisma:generate` – regenerate Prisma Client
- `npm run prisma:migrate` – run `prisma migrate dev`

### API Summary
Base URL: `http://localhost:PORT`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/resources` | Create resource (`name`, `description?`, `tags?`, `isActive?`) |
| GET | `/api/resources` | List resources with optional `search`, `tag`, `isActive` filters |
| GET | `/api/resources/:id` | Fetch resource details |
| PUT | `/api/resources/:id` | Update resource |
| DELETE | `/api/resources/:id` | Remove resource |

`GET /api/resources` filters:
- `search`: fuzzy match on `name`
- `tag`: single tag (repeat param for multiples)
- `isActive`: `true` or `false`

### Development Notes
- Persistence handled via Prisma ORM + SQLite.
- Tags are stored internally as comma-delimited text but exposed as arrays in the API.
- Health probe at `/health`.
- Central config ensures no hardcoded values.

