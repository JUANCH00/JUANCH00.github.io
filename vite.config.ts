import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const layer = (name: string) => fileURLToPath(new URL(`./src/${name}`, import.meta.url))

/**
 * The alias map mirrors the architectural layers documented in docs/ARCHITECTURE.md.
 * Imports read as `@domain/...`, `@ui/...` etc. so a reviewer can see, at the import
 * line alone, which layer a module depends on.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@domain': layer('domain'),
      '@infrastructure': layer('infrastructure'),
      '@application': layer('application'),
      '@ui': layer('ui'),
      '@features': layer('features'),
      '@app': layer('app'),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx'],
    },
  },
})
