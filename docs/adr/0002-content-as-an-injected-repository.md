# 2. Content as an injected repository

- **Status:** Accepted
- **Date:** 2026-08-24

## Context

Portfolio content changes a few times a year: a new project, a new metric, a new
availability date. The obvious options were inlining copy in components,
importing a JSON module directly, or fetching from a CMS.

Inlined copy makes an edit a component change and makes content untestable.
A CMS adds a network dependency, a loading state and an account to maintain, for
content that changes less often than the code around it.

## Decision

Model the content as a typed `Profile` and expose it through a
`ProfileRepository` port. `StaticProfileRepository` — the only adapter today —
returns a compiled-in constant. `src/main.tsx` constructs it and injects it into
`<App>`; components read it through `useProfile()`.

## Consequences

- No runtime fetch, no loading state, no request waterfall: content ships in the
  bundle.
- Tests render the whole page against a deliberately fake profile, with no module
  mocking, which is why `tests/app.test.tsx` can assert exact strings.
- `staticProfile.test.ts` asserts invariants over the content itself — the class
  of bug (dead link, duplicated id) that types cannot catch.
- Moving to a CMS later means writing a second adapter and changing one line. If
  that happens, the async version will need a loading state that today's UI does
  not have; that is the accepted trade-off.
