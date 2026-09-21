import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { pickActiveSection, useActiveSection } from './useActiveSection'

describe('pickActiveSection', () => {
  const ids = ['work', 'lab', 'contact'] as const

  it('is null while no section is on the reading line', () => {
    expect(pickActiveSection(ids, new Set())).toBeNull()
  })

  it('returns the only visible section', () => {
    expect(pickActiveSection(ids, new Set(['lab']))).toBe('lab')
  })

  it('breaks ties by page order, not by insertion order', () => {
    expect(pickActiveSection(ids, new Set(['contact', 'work']))).toBe('work')
  })

  it('ignores ids that are not part of the page', () => {
    expect(pickActiveSection(ids, new Set(['elsewhere']))).toBeNull()
  })
})

/** Minimal stand-in that lets a test decide what is intersecting. */
class FakeIntersectionObserver {
  static instance: FakeIntersectionObserver | null = null
  readonly observed: Element[] = []

  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instance = this
  }

  observe(element: Element) {
    this.observed.push(element)
  }

  disconnect() {}

  emit(id: string, isIntersecting: boolean) {
    const target = this.observed.find((element) => element.id === id)
    if (!target) throw new Error(`${id} is not observed`)
    this.callback(
      [{ target, isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
}

describe('useActiveSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('follows the section crossing the reading line', () => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    document.body.innerHTML = '<section id="work"></section><section id="lab"></section>'
    const ids = ['work', 'lab']

    const { result } = renderHook(() => useActiveSection(ids))
    const observer = FakeIntersectionObserver.instance!
    expect(observer.observed.map((element) => element.id)).toEqual(['work', 'lab'])
    expect(result.current).toBeNull()

    act(() => observer.emit('work', true))
    expect(result.current).toBe('work')

    act(() => {
      observer.emit('work', false)
      observer.emit('lab', true)
    })
    expect(result.current).toBe('lab')
  })

  it('does nothing where IntersectionObserver does not exist', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const { result } = renderHook(() => useActiveSection(['work']))
    expect(result.current).toBeNull()
  })
})
