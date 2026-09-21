import { Fragment } from 'react'
import { VisuallyHidden } from './VisuallyHidden'
import styles from './Marquee.module.css'

interface MarqueeProps {
  readonly items: readonly string[]
  readonly label: string
}

/**
 * An infinite ticker. The list is rendered twice so the track can translate by
 * exactly -50% and loop seamlessly. Both copies are hidden from assistive
 * technology and the same content is exposed once, as plain text — a screen
 * reader should hear the stack, not a duplicated carousel.
 */
export const Marquee = ({ items, label }: MarqueeProps) => (
  <div className={styles.marquee}>
    <VisuallyHidden>{`${label}: ${items.join(', ')}`}</VisuallyHidden>
    <div className={styles.track} aria-hidden="true">
      {[0, 1].map((copy) =>
        items.map((item) => (
          <Fragment key={`${copy}-${item}`}>
            <span>{item}</span>
            <span className={styles.separator}>/</span>
          </Fragment>
        )),
      )}
    </div>
  </div>
)
