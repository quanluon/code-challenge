# 99Tech Code Challenge #1

This workspace contains my solutions for each problem statement. Every problem has its own folder under `src/`, keeping implementations isolated and easy to review:

- `problem4`: TypeScript implementations of `sum_to_n` using three unique strategies.
- `problem5`: Express + TypeScript backend demonstrating CRUD operations with Prisma + SQLite (see `src/problem5/README.md` for full instructions).
- `problem6`: Scoreboard API module specification with comprehensive documentation, security measures, and flow diagrams (see `src/problem6/README.md` for full specification).

## Running Problem 5 backend
```bash
cd src/problem5
npm install
npm run prisma:migrate
npm run dev
```

## Problem 6 - Scoreboard API Specification

The specification document in `src/problem6/` includes:
- Complete API endpoint documentation
- Security architecture and measures
- Database schema design
- Real-time update mechanisms (WebSocket/SSE)
- Performance optimization strategies
- Implementation flow diagrams (see `src/problem6/FLOW_DIAGRAM.md`)

This specification is ready for backend engineering team implementation.

## Notes
- Node.js 20+ is required for problem5.
- Environment variables are loaded via `.env` (see `src/problem5/README.md` for details).