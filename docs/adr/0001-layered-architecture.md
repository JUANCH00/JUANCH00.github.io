# 1. Layered architecture with an enforced dependency rule

- **Status:** Accepted
- **Date:** 2026-08-24

## Context

A portfolio site is small enough to write as a handful of components with the
content inlined in JSX. It is also, for an engineering internship, a code
sample: someone may open the repository before they open the site. A structure
that only pays off at scale is the wrong choice; a structure that shows how I
think about dependencies is the right one, provided it does not become theatre.

## Decision

Split the source into six layers — `domain`, `application`, `infrastructure`,
`ui`, `features`, `app` — with dependencies pointing inwards only, and enforce
that rule with a test (`tests/architecture.test.ts`) that parses every import.

Path aliases (`@domain/...`, `@ui/...`) make each import state its layer, so a
violation is visible while reading, not only when CI fails.

## Consequences

- The rules of both interactive widgets are plain TypeScript, testable without a
  DOM, and were in fact developed test-first.
- Swapping the content source is a one-file change (see ADR 2).
- The cost is real: more files than a single-component site, and a contributor
  must learn where things go. `docs/ARCHITECTURE.md` exists to pay that cost
  down.
- An architecture document can drift from the code; a test cannot. This is the
  reason the rule is executable.
