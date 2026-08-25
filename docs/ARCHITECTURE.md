# Architecture

This is a static single-page portfolio. It is small on purpose — and structured
as if it were not, because the point of the codebase is to be read.

## The dependency rule

Six layers. Dependencies point **inwards only**:

```
              ┌───────────────────────────────────────────┐
              │  app/            composition root         │
              │  ├── features/   page sections            │
              │  │   ├── ui/     design system            │
              │  │   ├── application/  React ↔ domain     │
              │  │   │   └── domain/   pure rules         │
              │  │   └── infrastructure/  adapters        │
              └───────────────────────────────────────────┘

   domain          ←  knows nothing about anything else
   application     ←  domain
   infrastructure  ←  domain
   ui              ←  nothing (framework primitives only)
   features        ←  domain, application, ui, app
   app             ←  everything
```

`tests/architecture.test.ts` enforces this by parsing every import in `src/`.
Break the rule and CI fails — the diagram above cannot silently go stale.

## What lives where

| Layer              | Path                 | Contains                                                                                                                                                                    | May import                   |
| ------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Domain**         | `src/domain`         | Types and pure rules: the profile model, the penalty scoring rules, the cluster state machine. No React, no DOM, no `window`.                                               | nothing                      |
| **Application**    | `src/application`    | The React bindings: context provider, `useProfile`, `usePenaltyGame`, `useClusterSimulation`. Owns timers and effects; delegates every decision to the domain.              | domain                       |
| **Infrastructure** | `src/infrastructure` | Adapters to the outside world: the profile content and the `StaticProfileRepository` that serves it, plus the one place that reads `import.meta.env`.                       | domain                       |
| **UI**             | `src/ui`             | The design system: tokens, primitives (`Section`, `Reveal`, `Marquee`, `TagList`, `SkipLink`, `VisuallyHidden`), generic hooks, the pointer halo. Knows nothing about Juan. | nothing                      |
| **Features**       | `src/features`       | One folder per page section, each owning its markup, styles and section-specific logic.                                                                                     | domain, application, ui, app |
| **App**            | `src/app`            | Composition root, section map, error boundary.                                                                                                                              | everything                   |

## Decisions worth knowing

**Content is data, not markup.** Every word lives in
`src/infrastructure/profile/staticProfile.data.ts` as a typed `Profile`. Adding
a project is editing an array. `staticProfile.test.ts` then checks invariants
across all content at once — unique ids, `https://` links, no project without a
repository, no note marked published without a URL.

**The repository is a port.** Components depend on the `ProfileRepository`
interface, never on the constant. Moving to a CMS or an API means writing one
adapter and changing one line in `src/main.tsx`.

**Game rules are pure functions.** The penalty scoring and the cluster failover
are plain TypeScript state machines with injected randomness and clock, so both
are exhaustively unit-tested without rendering a component. The React hooks
above them only own timers and animation positions.

**The domain never writes English.** The cluster emits events like
`{ kind: 'node-down', nodeId: 1 }`; `clusterMessages.ts` in the UI layer turns
them into text. Translating the site touches one file.

**Geometry is computed, not measured.** Both lab widgets derive positions from
pure functions (`goalGeometry.ts`, `clusterLayout.ts`) instead of reading
`getBoundingClientRect` during interaction — no layout thrash, and the maths is
unit-tested.

**One accent colour, one token file.** `src/ui/styles/tokens.css` holds every
colour, type size, space step and easing curve. Components reference tokens and
never hard-code values, so the whole site can be re-themed from one screen.

## Accessibility and motion

- Every section is a labelled landmark; a skip link is the first tab stop.
- The canvas cluster is fully operable from the keyboard through real buttons
  that drive the same state — the canvas is a view, not the only control.
- Every goal cell is a `<button>` with a spoken label ("shoot top left"), and
  outcomes are announced through `role="status"`.
- `prefers-reduced-motion` is honoured in one place (the token file) and by the
  reveal hook, the marquee and the cluster animation; the pointer halo is not
  rendered at all for reduced motion or touch pointers.
- An unpublished note renders as an `<article>`, never as a link to nowhere.

## Testing

| Kind         | Where                                              | What it protects                                                                        |
| ------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Unit         | `src/domain/**/*.test.ts`                          | Scoring, failover, text splitting — the rules                                           |
| Unit         | `src/features/lab/**/*.test.ts`                    | Pitch and cluster geometry                                                              |
| Contract     | `src/infrastructure/profile/staticProfile.test.ts` | Content invariants                                                                      |
| Integration  | `tests/app.test.tsx`                               | The page renders an injected profile, nav anchors resolve, the lab is keyboard-operable |
| Architecture | `tests/architecture.test.ts`                       | The dependency rule                                                                     |

`npm run verify` runs typecheck, lint, tests and build — the same gate CI uses.
