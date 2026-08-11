# ShopSphere

An e-commerce backend built over 6 months to practice real backend
engineering: relational + document data modeling, caching, async job
processing, concurrency handling, security, observability, and one
AI-native feature (semantic product search).

**Status:** 🚧 Month 1 - Foundations (see `docs/architecture.md` and the
roadmap board for progress)

## Stack
TypeScript · Node.js/Express · PostgreSQL (Prisma) · MongoDB · Redis · BullMQ

## Getting started
```bash
cp .env.example .env       # then fill in real values
npm install
npm run dev                # starts the API with hot reload
```

Requires local Postgres, MongoDB, and Redis (Docker Compose setup lands in
Month 5 - see the roadmap).

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm test` | Run the test suite |
| `npm run lint` | Lint the codebase |
| `npm run typecheck` | Type-check without emitting files |

## Docs
- [`docs/architecture.md`](docs/architecture.md) - system overview and data flow
- [`docs/adr/`](docs/adr) - architecture decision records, one per major choice

## Roadmap
This project is built task-by-task against a 6-month plan (data modeling →
auth/security → caching/queues → scale/concurrency → AI/DevOps →
observability/launch). Each ADR in `docs/adr/` corresponds to a real decision
made along the way.
