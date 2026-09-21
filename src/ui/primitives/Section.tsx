import type { ReactNode } from 'react'
import { Container } from './Container'
import styles from './Section.module.css'

interface SectionProps {
  readonly id: string
  /** The visible heading, written in sentence case; CSS sets the capitals. */
  readonly title: string
  /** Optional tally beside the title, such as the number of projects. */
  readonly count?: number | undefined
  /** One sentence of context under the title, only when the title is not enough. */
  readonly description?: string | undefined
  /** A secondary link aligned with the heading. */
  readonly aside?: ReactNode
  readonly children: ReactNode
}

/**
 * Every top-level block is a labelled landmark whose heading is also the
 * biggest thing in it: the page's structure is visible at a scan, and the
 * same element names the landmark for screen readers, so the two cannot
 * drift apart.
 */
export const Section = ({ id, title, count, description, aside, children }: SectionProps) => (
  <Container as="section" id={id} aria-labelledby={`${id}-heading`} className={styles.section}>
    <header className={styles.header}>
      <div className={styles.headingRow}>
        <h2 id={`${id}-heading`} className={styles.title}>
          {title}
          {/* The list below already says how many; the number is for the eye. */}
          {count !== undefined && (
            <span className={styles.count} aria-hidden="true">
              {count}
            </span>
          )}
        </h2>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </header>
    {children}
  </Container>
)
