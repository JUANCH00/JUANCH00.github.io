import { useEffect, useRef, useState } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '@ui/hooks/useMediaQuery'
import styles from './PointerHalo.module.css'

/** Anything that should make the halo swell when hovered. */
const INTERACTIVE_SELECTOR = 'a, button, [data-interactive]'

/**
 * The blend-mode dot that trails the pointer.
 *
 * Two decisions worth naming:
 *  - It is not rendered at all on touch devices or when reduced motion is
 *    requested, rather than being hidden with CSS — no listeners, no cost.
 *  - Hover detection is delegated from `document` via `closest()` instead of
 *    attaching listeners to every link on mount, so elements that appear later
 *    (the lab grid, the log) work without re-registering anything.
 */
export const PointerHalo = () => {
  const finePointer = useFinePointer()
  const reducedMotion = usePrefersReducedMotion()
  const enabled = finePointer && !reducedMotion
  const haloRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let frame = 0
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const halo = haloRef.current
        if (halo) {
          halo.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
        }
      })
    }

    const over = (event: PointerEvent) => {
      const target = event.target
      setActive(target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={haloRef}
      aria-hidden="true"
      className={`${styles.halo}${active ? ` ${styles.active}` : ''}`}
    />
  )
}
