# juanch00.github.io

Personal engineering portfolio of **Juan Esteban Moreno** — Systems Engineering
student at UPTC (Tunja, Colombia) and AI Trainer at Outlier, looking for a
software engineering / machine learning internship from January 2027.

**Live:** https://juanch00.github.io

![CI & Deploy](https://github.com/JUANCH00/JUANCH00.github.io/actions/workflows/deploy.yml/badge.svg)

---

## What is interesting here

It is a one-page site, so the interesting part is not the feature list — it is
how it is put together.

- **Two interactive demos backed by real numbers.** The penalty keeper saves at
  exactly the 54% validation accuracy of my World Cup classifier; the cluster
  widget reproduces the failover behaviour of Temuviator, my three-node
  distributed system. Both are pure state machines in `src/domain/lab`, unit
  tested without a browser.
- **An enforced dependency rule.** Six layers, dependencies pointing inwards,
  checked by a test that parses every import in the codebase.
- **Content as typed data.** Every word on the page is a `Profile` object behind
  a repository interface, with invariant tests over it.
- **Accessible by construction.** Landmarks, a skip link, keyboard control for
  the canvas widget, announced game outcomes, and full
  `prefers-reduced-motion` support.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the layer map and
[`docs/adr/`](docs/adr) for the decision records.

## Stack

|          |                                                                               |
| -------- | ----------------------------------------------------------------------------- |
| Language | TypeScript (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) |
| UI       | React 19                                                                      |
| Build    | Vite                                                                          |
| Styling  | CSS Modules over custom-property design tokens                                |
| Tests    | Vitest + Testing Library                                                      |
| Quality  | ESLint (type-checked rules), Prettier                                         |
| CI/CD    | GitHub Actions → GitHub Pages                                                 |

No CSS framework, no state management library, no UI kit.

## Running it

Requires Node 20+ (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script               | Does                                          |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Dev server with hot reload                    |
| `npm run build`      | Typecheck and build to `dist/`                |
| `npm run preview`    | Serve the production build locally            |
| `npm test`           | Run the test suite once                       |
| `npm run test:watch` | Watch mode                                    |
| `npm run lint`       | ESLint                                        |
| `npm run format`     | Prettier, writing changes                     |
| `npm run verify`     | Typecheck + lint + test + build — the CI gate |

## Project layout

```
src/
  domain/          Pure rules and types. No React, no DOM.
  application/     React bindings over the domain (context, hooks).
  infrastructure/  Adapters: the profile content and its repository.
  ui/              Design system: tokens, primitives, generic hooks.
  features/        One folder per page section.
  app/             Composition root, section map, error boundary.
tests/             Integration + architecture tests, fixtures.
docs/              Architecture notes and ADRs.
public/            CV, favicon, social image, robots, sitemap.
```

## Editing the content

All copy lives in one typed file:
`src/infrastructure/profile/staticProfile.data.ts`. Adding a project means
adding an object to the `projects` array — the compiler checks the shape and
`staticProfile.test.ts` checks the invariants.

To replace the CV, overwrite `public/cv/juan-esteban-moreno-cv.pdf`.

## Deployment

Every push to `main` runs the full gate and, if it passes, publishes to GitHub
Pages. Nothing is built or uploaded by hand and `dist/` is never committed.

## License

Source code: [MIT](LICENSE). Written content, CV and imagery: © Juan Esteban
Moreno — please do not republish them as your own.
