# ERD: PostgreSQL schema

```
users                    categories
─────────                ─────────
id (PK)                  id (PK)
email (unique)           name (unique)
password_hash            slug (unique)
role
                               │ 1
                               │
                               │ N
                          products
                          ─────────
                          id (PK)
                          name
                          description
                          price_cents
                          category_id (FK -> categories.id)
                               │ 1
                    ┌──────────┴──────────┐
                    │ 1                   │ N
              inventory              order_items
              ─────────              ─────────────
              id (PK)                id (PK)
              product_id (FK, unique) order_id (FK -> orders.id)
              quantity               product_id (FK -> products.id)
                                     quantity
                                     unit_price_cents
                                          │ N
                                          │
                                          │ 1
   users ──── 1 ──── N ──── orders ───────┘
                     ─────────
                     id (PK)
                     user_id (FK -> users.id)
                     status (enum)
                     total_cents
```

## Relationships
- `users 1—N orders` — a user has many orders.
- `categories 1—N products` — a category has many products.
- `products 1—1 inventory` — each product has exactly one inventory row (kept
  separate from `products` so stock updates don't lock product metadata).
- `orders 1—N order_items`, `products 1—N order_items` — an order item links
  one order to one product, snapshotting price at purchase time.

## Indexes and why each exists
| Index | On | Why |
|---|---|---|
| `products_category_id_idx` | `products(category_id)` | Catalog browsing filters by category constantly — without this it's a full table scan per request. Verified with `EXPLAIN`: uses a bitmap index scan, not a seq scan. |
| `orders_user_id_created_at_idx` | `orders(user_id, created_at DESC)` | "My order history, newest first" is the #1 order query. A composite index matching the exact filter+sort avoids a separate sort step. Verified with `EXPLAIN`. |
| `order_items_order_id_idx`, `order_items_product_id_idx` | `order_items(order_id)`, `order_items(product_id)` | Both directions get queried: "items in this order" (order confirmation) and "orders containing this product" (future analytics). |
| unique constraints on `users.email`, `categories.name/slug`, `inventory.product_id` | — | These aren't performance indexes — they're correctness constraints. A duplicate email or two inventory rows for one product are data-integrity bugs, not just slow queries. |

## How this was verified
Prisma's CLI needs to download engine binaries from `binaries.prisma.sh`,
which isn't reachable from the sandbox this was built in. So instead of
trusting the schema by inspection, the equivalent raw SQL
(`prisma/migrations/20260809120000_init/migration.sql`) was applied directly
to a real local Postgres instance, then checked with real data:
- A foreign key violation was intentionally triggered (fake `category_id`)
  and confirmed to be rejected.
- `EXPLAIN` was run on the category-lookup and order-history queries and
  confirmed both use the new indexes (`Bitmap Index Scan`), not a sequential
  scan.

On your machine, `npx prisma migrate dev` will regenerate and track this
migration the normal Prisma way — the SQL above is intentionally equivalent
to what it would produce.
