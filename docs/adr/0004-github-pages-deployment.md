# 4. Deploy to GitHub Pages from GitHub Actions

- **Status:** Accepted
- **Date:** 2026-08-24

## Context

The site must be free to host, live at a URL suitable for a CV, and deployable
without a manual build step that I could forget to run.

## Decision

Publish to GitHub Pages from the `main` branch using the official Pages actions
(`upload-pages-artifact` + `deploy-pages`), with the build artifact produced by a
`verify` job that first typechecks, lints, checks formatting, tests and builds.

The repository is named `JUANCH00.github.io`, so the site serves from the root
path and Vite's `base` stays `/`.

## Consequences

- A push to `main` that fails any gate is never published: `deploy` declares
  `needs: verify`.
- Pull requests run the same gate but never deploy.
- No `gh-pages` branch and no committed `dist/`; the artifact is built in CI, so
  the repository holds only source.
- Pages serves static files only. Anything needing a server later (a contact
  form, an API) would require a different host — an accepted limit, since the
  interactive parts of this site run entirely in the browser.
- Asset URLs are resolved through `import.meta.env.BASE_URL` in
  `src/infrastructure/profile/asset.ts`, so moving to a project page
  (`/portfolio/`) would not break the CV download.
