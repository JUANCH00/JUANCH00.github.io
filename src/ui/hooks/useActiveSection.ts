import { useEffect, useState } from 'react'

/**
 * The first id, in page order, whose section is on the reading line. Page order
 * breaks ties: when two sections both touch the line, the earlier one wins.
 */
export const pickActiveSection = (
  ids: readonly string[],
  visible: ReadonlySet<string>,
): string | null => ids.find((id) => visible.has(id)) ?? null

/**
 * A thin band just above the middle of the viewport is the "reading line": the
 * section crossing it is the one being read. Top and bottom insets are
 * negative root margins, so the band is 5% of the viewport tall.
 */
const READING_LINE = '-40% 0px -55% 0px'

/**
 * Which section the visitor is reading, for `aria-current` in the nav.
 *
 * IntersectionObserver instead of a scroll listener: the browser reports
 * crossings off the main thread, so nothing runs per scroll frame. Returns
 * `null` in the hero, before any section has reached the line, and wherever
 * the API does not exist.
 *
 * `ids` must be referentially stable (a module constant), or the observer is
 * rebuilt on every render.
 */
export const useActiveSection = (ids: readonly string[]): string | null => {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        setActive(pickActiveSection(ids, visible))
      },
      { rootMargin: READING_LINE },
    )

    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}
