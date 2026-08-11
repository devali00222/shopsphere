# ShopSphere Architecture

## Overview
ShopSphere is an e-commerce backend built to demonstrate real backend engineering
judgment, not just CRUD: relational modeling, document modeling, caching, async
processing, concurrency handling, security, observability, and one AI-native
feature (semantic search).

## System diagram (high level)

```
                        ┌─────────────┐
                        │   Client    │
                        └──────┬──────┘
                               │ HTTPS
                        ┌──────▼──────┐
                        │  Express API │  (auth, validation, rate limiting)
                        └──┬───┬───┬──┘
              ┌────────────┘   │   └────────────┐
              ▼                ▼                ▼
      ┌───────────────┐ ┌─────────────┐ ┌───────────────┐
      │  PostgreSQL    │ │  MongoDB    │ │    Redis      │
      │  users         │ │  reviews    │ │  cache        │
      │  products      │ │  activity   │ │  cart         │
      │  inventory     │ │  logs       │ │  queue (BullMQ)│
      │  orders        │ └─────────────┘ └───────┬───────┘
      └───────────────┘                          │
                                          ┌───────▼───────┐
                                          │ BullMQ Workers │
                                          │ (order proc.,  │
                                          │  emails)       │
                                          └───────────────┘
```

## Why this data split
| Store       | Used for                          | Why |
|-------------|------------------------------------|-----|
| PostgreSQL  | users, products, inventory, orders | Needs strong consistency and relational integrity - you cannot afford a lost or double-counted order. |
| MongoDB     | reviews, activity logs             | High write volume, flexible/evolving shape, no strict relational needs. |
| Redis       | cache, cart, queue backing store   | Ephemeral or fast-access data where losing it occasionally is acceptable, and low latency matters more than durability. |

See `docs/adr/0001-data-store-split.md` for the fuller reasoning and trade-offs.

## Request flow: checkout (the most complex path)
1. Client calls `POST /v1/cart/checkout` (authenticated).
2. API reads the cart from Redis, validates it's non-empty.
3. API opens a Postgres transaction, locks the relevant inventory rows,
   creates the order in `pending` state.
4. API enqueues a BullMQ job to finish processing (mock payment, decrement
   inventory, send confirmation email) and responds immediately with the
   order ID.
5. Worker processes the job, updates order status, clears the cart.

This flow is intentionally the hardest one in the system - it's where
concurrency (Month 4) and async processing (Month 3) meet.

## Directory structure
```
src/
  modules/       # one folder per domain: users, products, orders, cart, reviews, search
  infra/         # db clients, redis, queue setup, env/logger
  middleware/    # auth, error handling, rate limiting
  jobs/          # BullMQ worker definitions
docs/
  architecture.md
  adr/           # architecture decision records
```

## Status
This document will be updated as each month's tasks land. Treat it as a
living doc, not a one-time write-up.
