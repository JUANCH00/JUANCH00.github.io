import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '@app/App'
import { StaticProfileRepository } from '@infrastructure/profile/StaticProfileRepository'

const DASH = /[–—]/

/**
 * The voice rules from design/jem-design-system-v2, checked against the real
 * page rather than a fixture: what a visitor reads and what a screen reader
 * says are both in scope, so aria-labels are checked alongside visible text.
 */
describe('the published copy', () => {
  it('contains no em or en dash in visible text', () => {
    const { container } = render(<App repository={new StaticProfileRepository()} />)
    const text = container.textContent ?? ''

    expect(text.length).toBeGreaterThan(1000)
    expect(text.match(DASH)).toBeNull()
  })

  it('contains no em or en dash in anything read aloud', () => {
    const { container } = render(<App repository={new StaticProfileRepository()} />)
    const spoken = [...container.querySelectorAll('[aria-label]')].map(
      (element) => element.getAttribute('aria-label') ?? '',
    )

    expect(spoken.length).toBeGreaterThan(5)
    expect(spoken.filter((label) => DASH.test(label))).toEqual([])
  })

  it('never uses decorative section numbering', () => {
    const { container } = render(<App repository={new StaticProfileRepository()} />)
    const headings = [...container.querySelectorAll('h2, h3')].map((h) => h.textContent ?? '')

    expect(headings.filter((heading) => /^\s*\d{2}\s*\//.test(heading))).toEqual([])
  })
})
