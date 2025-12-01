# 99Tech Code Challenge #1

This workspace contains my solutions for each problem statement. Every problem has its own folder under `src/`, keeping implementations isolated and easy to review:

- `problem4`: TypeScript implementations of `sum_to_n` using three unique strategies.
- `problem5`: Express + TypeScript backend demonstrating CRUD operations with Prisma + SQLite (see `src/problem5/README.md` for full instructions).

## Running Problem 5 backend
```bash
cd src/problem5
npm install
npm run prisma:migrate
npm run dev
```

## Notes
- Node.js 20+ is required.
- Environment variables are loaded via `.env` (see `src/problem5/README.md` for details).