// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const SRC = fileURLToPath(new URL('../src', import.meta.url))

type Layer = 'domain' | 'application' | 'infrastructure' | 'ui' | 'features' | 'app'

/**
 * The dependency rule, as data.
 *
 * Dependencies point inwards only: `domain` knows nothing about anything else,
 * and the outermost layers may know about the inner ones. Architecture
 * documents drift; this test does not — break the rule and CI goes red.
 */
const ALLOWED: Record<Layer, readonly Layer[]> = {
  domain: [],
  application: ['domain'],
  infrastructure: ['domain'],
  ui: [],
  features: ['domain', 'application', 'ui', 'app'],
  app: ['domain', 'application', 'ui', 'features'],
}

/** Layers that must never depend on a UI framework. */
const FRAMEWORK_FREE: readonly Layer[] = ['domain']

const LAYERS = Object.keys(ALLOWED) as Layer[]

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [full] : []
  })

const layerOf = (file: string): Layer | null => {
  const [first] = relative(SRC, file).split(sep)
  return LAYERS.includes(first as Layer) ? (first as Layer) : null
}

const importsOf = (file: string): string[] =>
  [...readFileSync(file, 'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)].map(
    (match) => match[1] ?? '',
  )

const files = sourceFiles(SRC)

describe('layer boundaries', () => {
  it('finds source files to check', () => {
    expect(files.length).toBeGreaterThan(20)
  })

  it.each(LAYERS)('%s only imports layers it is allowed to', (layer) => {
    const violations: string[] = []

    for (const file of files.filter((candidate) => layerOf(candidate) === layer)) {
      for (const specifier of importsOf(file)) {
        const match = /^@(\w+)\//.exec(specifier)
        const target = match?.[1] as Layer | undefined
        if (!target || !LAYERS.includes(target) || target === layer) continue
        if (!ALLOWED[layer].includes(target)) {
          violations.push(`${relative(SRC, file)} → ${specifier}`)
        }
      }
    }

    expect(violations).toEqual([])
  })

  it.each(FRAMEWORK_FREE)('%s stays free of framework imports', (layer) => {
    const violations: string[] = []

    for (const file of files.filter((candidate) => layerOf(candidate) === layer)) {
      for (const specifier of importsOf(file)) {
        if (/^(react|react-dom)(\/|$)/.test(specifier)) {
          violations.push(`${relative(SRC, file)} → ${specifier}`)
        }
      }
    }

    expect(violations).toEqual([])
  })

  it('keeps deep relative imports from tunnelling out of a layer', () => {
    const violations = files.filter((file) => importsOf(file).some((s) => s.includes('../../../')))
    expect(violations.map((file) => relative(SRC, file))).toEqual([])
  })
})
