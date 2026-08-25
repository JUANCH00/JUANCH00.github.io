/**
 * Resolve a path inside `public/` against the deployment base path.
 *
 * `import.meta.env.BASE_URL` is the one Vite-specific value the content layer
 * needs, and it lives here — in infrastructure — rather than leaking into the
 * domain data, so the site works unchanged at `/` (user page) or at
 * `/portfolio/` (project page) without editing content.
 */
export const asset = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
