import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './useMediaQuery'

const supportsObserver = typeof IntersectionObserver !== 'undefined'

/**
 * Reveal an element the first time it scrolls into view.
 *
 * One observer per element, disconnected as soon as it fires — the animation is
 * a one-shot entrance, so keeping a live observer around would cost work on
 * every scroll for no benefit.
 *
 * Visibility is *derived*, not synchronised: when the visitor prefers reduced
 * motion, or the browser has no IntersectionObserver, the element is visible
 * from its very first render, with no effect and no extra paint.
 */
export const useRevealOnScroll = <T extends HTMLElement>() => {
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef<T | null>(null)
  const [entered, setEntered] = useState(false)

  const skipAnimation = reducedMotion || !supportsObserver

  useEffect(() => {
    const element = ref.current
    if (skipAnimation || !element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [skipAnimation])

  return { ref, visible: entered || skipAnimation }
}
