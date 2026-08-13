# ADR 0003: Embed vs. reference for reviews and activity logs

**Status:** Accepted
**Date:** [today]

## Context
[Why did reviews and activity logs need this decision? What was the actual
question — what could you embed vs. reference, and why did it matter?]

## Decision
[State your embed-vs-reference calls:
1. Reviews as their own collection referencing productId — why not embed
   reviews inside the product document? (Hint: you know this — 16MB limit,
   write contention.)
2. Reviewer info embedded inside each review — why?]

## Alternatives considered
[What was the other option for the reviewer info decision, and why did you
reject it? This is where the trade-off from our review goes — the fact that
embedded name/avatar goes stale if the user updates their profile. Write
down that you considered referencing instead, and why you accepted the
staleness trade-off anyway.]

## Consequences
[What does this cost you? What would make you revisit it?]