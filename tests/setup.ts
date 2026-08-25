import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

/**
 * This file runs before every test file, including the ones that use the plain
 * `node` environment (the architecture test), hence the DOM guard.
 */
const hasDom = typeof window !== 'undefined'

if (hasDom) {
  /**
   * jsdom implements neither of these, and both are used by code that must keep
   * working in a real browser. Stubbing them here — once — is preferable to
   * scattering `typeof window.matchMedia === 'function'` guards through the app.
   */
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })
  }

  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }

  /**
   * jsdom has no canvas implementation and logs a "not implemented" error for
   * every call. The cluster view already handles a missing 2D context (it simply
   * does not draw), so returning null quietly is both accurate and silent.
   */
  HTMLCanvasElement.prototype.getContext = () => null
}

afterEach(() => {
  if (hasDom) cleanup()
  vi.useRealTimers()
})
