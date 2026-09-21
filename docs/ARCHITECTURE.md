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

| Layer              | Path                 | Contains                                                                                                                                                                                 | May import                   |
| ------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Domain**         | `src/domain`         | Types and pure rules: the profile model, the penalty scoring rules, the cluster state machine. No React, no DOM, no `window`.                                                            | nothing                      |
| **Application**    | `src/application`    | The React bindings: context provider, `useProfile`, `usePenaltyGame`, `useClusterSimulation`. Owns timers and effects; delegates every decision to the domain.                           | domain                       |
| **Infrastructure** | `src/infrastructure` | Adapters to the outside world: the profile content and the `StaticProfileRepository` that serves it, plus the one place that reads `import.meta.env`.                                    | domain                       |
| **UI**             | `src/ui`             | The design system in code: tokens, primitives (`Button`, `Container`, `Section`, `Reveal`, `Marquee`, `TagList`, `SkipLink`, `VisuallyHidden`), generic hooks. Knows nothing about Juan. | nothing                      |
| **Features**       | `src/features`       | One folder per page section, each owning its markup, styles and section-specific logic.                                                                                                  | domain, application, ui, app |
| **App**            | `src/app`            | Composition root, section map, error boundary.                                                                                                                                           | everything                   |

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
Even the cluster canvas, which cannot use `var()`, reads its palette from the
tokens at runtime instead of keeping its own hex values.

**The design system lives with the code.** `design/jem-design-system-v2/` holds
the audit the current look answers to (`design-system/AUDIT.md`, 20 findings),
the usage rules, component specs and before/after screenshots. The rules that
can be checked mechanically are tests, not prose: no em dash in anything
visible or spoken, a hero lead of 20 words at most, no decorative numbering,
nav order equal to page order. See [ADR 5](adr/0005-design-system-v2.md).

## Accessibility and motion

- Every section is a labelled landmark; a skip link is the first tab stop.
- Every interactive target is at least 44x44px, every text at least 12px and
  4.5:1 against its surface, every control border at least 3:1.
- The nav marks the section being read with `aria-current`, driven by an
  IntersectionObserver rather than a scroll listener.
- The canvas cluster is fully operable from the keyboard through real buttons
  that drive the same state — the canvas is a view, not the only control.
- Every goal cell is a `<button>` with a spoken label ("shoot top left"), and
  outcomes are announced through `role="status"`.
- `prefers-reduced-motion` is honoured in one place (the token file) and by the
  reveal hook, the marquee and the cluster animation. Everything that moves
  animates `transform` or `opacity` only, never a layout property.
- An unpublished note renders as an `<article>`, never as a link to nowhere.

## Testing

| Kind         | Where                                              | What it protects                                                                          |
| ------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Unit         | `src/domain/**/*.test.ts`                          | Scoring and failover: the rules                                                           |
| Unit         | `src/features/lab/**/*.test.ts`                    | Pitch and cluster geometry, the wording of every game state                               |
| Unit         | `src/ui/hooks/*.test.ts`                           | Which section counts as active                                                            |
| Unit         | `src/application/**/*.test.tsx`                    | The penalty hook under StrictMode: one draw and one point per shot, however React runs it |
| Contract     | `src/infrastructure/profile/staticProfile.test.ts` | Content invariants, including the voice rules                                             |
| Integration  | `tests/app.test.tsx`                               | The page renders an injected profile, nav matches page order, lab and email controls work |
| Copy         | `tests/copy.test.tsx`                              | The real page: no em dash in visible or spoken text, no decorative numbering              |
| Architecture | `tests/architecture.test.ts`                       | The dependency rule                                                                       |

`npm run verify` runs typecheck, lint, tests and build — the same gate CI uses.
