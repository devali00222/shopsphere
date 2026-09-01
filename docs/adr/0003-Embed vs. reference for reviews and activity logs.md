# ADR 0003: Embed vs. reference for reviews and activity logs

**Status:** Accepted
**Date:** 2026-08-12

## Context
Reviews and activity logs both needed a decision about where they live
relative to the data they're attached to. A product can accumulate an
unbounded number of reviews over time, and activity logs are written far
more often than any other data in the system (every view, search, and
cart-add generates one). Both are a poor fit for embedding directly inside
the `products` collection: MongoDB documents have a hard 16MB size limit,
and a product with thousands of reviews embedded in it would eventually hit
that ceiling — plus every new review would mean rewriting the entire
product document, causing write contention on data (name, description,
price) that changes far less often than reviews are added.

A second, smaller decision sat inside the reviews collection itself: does
each review embed a snapshot of the reviewer's name/avatar, or just
reference their `userId` and look the user up separately when displaying
reviews?

## Decision
1. **Reviews and activity logs are their own collections**, each referencing
   the relevant id (`productId` for reviews, `userId` for activity logs)
   rather than being embedded inside `products` or `users`. This avoids the
   16MB document limit and keeps high-write data from contending with
   low-write metadata.
2. **Reviewer info (`name`, `avatar`) is embedded as a snapshot inside each
   review**, rather than referenced by `userId` alone. This keeps review
   reads fast (no extra lookup per review) and means the reviewer's
   displayed name/avatar reflects what it was *at the time of the review*.

## Alternatives considered
For the reviewer-info decision, the alternative was referencing `userId`
only and joining against a `users` lookup whenever reviews are displayed.
That would keep reviewer info always current (if someone changes their
display name, old reviews would show the updated name too), at the cost of
an extra lookup per review render.

Embedding was chosen anyway, accepting the trade-off that a reviewer's
name/avatar in older reviews won't reflect later profile changes. Reviews
are treated as a historical record here — what someone saw at checkout time
is what should still show later — not a live-updating profile field.

## Consequences
- Faster reads: displaying a list of reviews needs no extra lookup per
  reviewer.
- Stale display data: if a user changes their name or avatar, their past
  reviews keep showing the old version. This is treated as acceptable,
  not a bug.
- Revisit if: a future requirement explicitly wants reviews to always show
  a user's current name/avatar (e.g. a "verified purchaser" badge that
  should reflect current account status) — that would call for referencing
  instead.