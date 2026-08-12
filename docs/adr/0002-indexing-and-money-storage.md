# ADR 0002: Indexing strategy and storing money as integer cents

**Status:** Accepted
**Date:** 2026-08-09

## Context
Two decisions in the Postgres schema needed explicit reasoning rather than
defaults: which columns to index, and how to represent prices.

## Decision 1: Indexes match actual query patterns, not "index everything"
Added indexes:
- `products(category_id)` — catalog browsing always filters by category.
- `orders(user_id, created_at DESC)` — order history always filters by user
  and sorts newest-first; a composite index matches both parts of that query
  at once.
- `order_items(order_id)` and `order_items(product_id)` — both directions
  are queried (order detail view, and future "orders containing product X"
  reporting).

Did **not** blanket-index every column. Every index speeds up reads but
slows down writes (the index has to be updated too) and takes disk space.
An index earns its place by matching a real, expected query — not by
"more indexes = faster" reasoning.

## Decision 2: Prices stored as `price_cents` (integer), not a decimal/float
Money is stored as an integer number of cents (`12999` = $129.99), not as
`FLOAT` or even `DECIMAL` in the initial schema.

**Why not float:** floats cannot represent most decimal fractions exactly
(the classic `0.1 + 0.2 !== 0.3` problem) — unacceptable for money, where
rounding errors compound across many orders.

**Why integer cents over `DECIMAL`:** `DECIMAL` would also work correctly
here and is a reasonable alternative. Integer cents was chosen because it
avoids any decimal/rounding configuration entirely, arithmetic in
application code is simple integer math, and it matches how most payment
provider APIs (Stripe included) represent amounts. The trade-off: every
price has to be divided by 100 and formatted for display — a small,
consistent cost paid once in the presentation layer.

## Consequences
- Every place that displays a price must divide by 100 and format it —
  this belongs in a single shared formatting utility, not repeated inline,
  to avoid the classic "forgot to divide by 100 in one spot" bug.
- If ShopSphere ever needs fractional-cent pricing (it won't), this would
  need revisiting. Not a realistic concern for this project.
