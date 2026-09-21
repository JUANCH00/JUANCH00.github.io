import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * Subscribe to a media query.
 *
 * `useSyncExternalStore` is the right primitive here: it keeps the value
 * consistent with the browser during concurrent renders, and its server
 * snapshot lets the same hook run under a non-DOM environment without guards
 * scattered through the components.
 */
export const useMediaQuery = (query: string): boolean =>
  useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return noop()
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () =>
      typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false,
    () => false,
  )

export const usePrefersReducedMotion = (): boolean =>
  useMediaQuery('(prefers-reduced-motion: reduce)')
