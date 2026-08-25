import type { ReactNode } from 'react'
import styles from './Section.module.css'

interface SectionProps {
  readonly id: string
  /** Accessible name for the landmark; visually rendered by `label` when given. */
  readonly title: string
  readonly label?: ReactNode
  readonly aside?: ReactNode
  readonly tight?: boolean
  readonly children: ReactNode
}

/**
 * Every top-level block on the page is a labelled landmark. Screen-reader users
 * get a real section list; sighted users get the mono kicker. One component
 * guarantees the two never drift apart.
 */
export const Section = ({ id, title, label, aside, tight, children }: SectionProps) => (
  <section
    id={id}
    aria-labelledby={`${id}-heading`}
    className={`${styles.section}${tight ? ` ${styles.tight}` : ''}`}
  >
    <h2 id={`${id}-heading`} className={styles.label}>
      <span>{label ?? title}</span>
      {aside}
    </h2>
    {children}
  </section>
)
