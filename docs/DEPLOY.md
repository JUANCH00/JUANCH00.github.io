# Deploying

The site is published to GitHub Pages by the `CI & Deploy` workflow. Once the
one-time setup below is done, deploying is `git push`.

## One-time setup

1. **Create the repository** at <https://github.com/new>, named exactly
   `JUANCH00.github.io`, **Public**, with no README, `.gitignore` or licence
   (this repository already has them).

2. **Push this repository:**

   ```bash
   git remote add origin https://github.com/JUANCH00/JUANCH00.github.io.git
   git push -u origin main
   ```

3. **Point Pages at Actions.** In the repository, go to
   **Settings → Pages → Build and deployment** and set **Source** to
   **GitHub Actions**. This step is required: with the default "Deploy from a
   branch" setting the workflow will fail at the deploy job.

4. Watch the run under the **Actions** tab. The site appears at
   <https://juanch00.github.io> a minute or so after it goes green.

## Every deploy after that

```bash
git add -A
git commit -m "content: update availability date"
git push
```

`verify` runs typecheck, lint, format check, tests and build. If any of them
fails, nothing is published and the previous version stays live.

Run the same gate locally before pushing:

```bash
npm run verify
```

## Custom domain (optional)

1. Add a `CNAME` record at your DNS provider pointing your domain at
   `juanch00.github.io`.
2. Enter the domain under **Settings → Pages → Custom domain** and enable
   **Enforce HTTPS**.
3. Update the absolute URLs in `index.html` (`canonical`, `og:url`,
   `og:image`), `public/robots.txt` and `public/sitemap.xml`.

## Moving to a project page instead

If the site ever lives at `https://juanch00.github.io/portfolio/` rather than at
the root, set `base: '/portfolio/'` in `vite.config.ts`. Asset paths already
resolve through `import.meta.env.BASE_URL`, so the CV download keeps working.
