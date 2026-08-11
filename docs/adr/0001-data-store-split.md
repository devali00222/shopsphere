# ADR 0001: Split data across PostgreSQL, MongoDB, and Redis

**Status:** Accepted
**Date:** 2026-08-09

## Context
ShopSphere needs to store several kinds of data with very different
consistency, structure, and access-pattern requirements:
- Transactional data (users, products, inventory, orders) where correctness
  and relationships matter (an order must reference a real user and real
  products; inventory must never go negative).
- High-write, loosely structured data (product reviews, user activity logs)
  that doesn't need strict relational integrity and may change shape often.
- Ephemeral, latency-sensitive data (shopping cart, cache, job queue) where
  losing a small amount of data occasionally is an acceptable trade-off for
  speed and simplicity.

A single database could technically hold all of this, but each kind of data
is a poor fit for at least one of the others' natural storage model.

## Decision
Use three data stores, each for what it's good at:
- **PostgreSQL** for users, products, inventory, and orders - relational
  integrity via foreign keys, ACID transactions for checkout correctness.
- **MongoDB** for reviews and activity logs - flexible schema, high write
  throughput, no need for joins against this data.
- **Redis** for cart, cache, and as the backing store for BullMQ - in-memory
  speed, TTL-based expiry, and pub/sub-friendly primitives.

## Alternatives considered
- **Postgres for everything** (including reviews/logs as JSONB columns).
  Rejected for this project because it would remove the opportunity to
  practice real document-store modeling trade-offs, and because activity
  logs at scale are a genuinely awkward fit for a relational table (high
  write volume, no need for joins, schema will evolve).
- **MongoDB for everything** (including orders/inventory). Rejected because
  multi-document transactions in Mongo are more awkward than Postgres's
  native transaction support, and inventory/checkout correctness benefits
  directly from strong relational constraints and row-level locking.

## Consequences
- **Cost:** more operational complexity - three systems to run, monitor, and
  back up instead of one. Acceptable here because the project's explicit
  goal is to practice this kind of trade-off, and each store is genuinely
  earning its place rather than being added for its own sake.
- **Benefit:** each data type lives in the store best suited to it, and the
  project produces real, defensible answers to "why did you choose X over Y"
  instead of a single default choice used everywhere out of habit.
- **Revisit if:** operational overhead becomes the actual bottleneck (e.g. in
  a much smaller team/project), in which case consolidating logs/reviews into
  Postgres JSONB would be a reasonable simplification.
