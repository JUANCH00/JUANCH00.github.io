import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useRevealOnScroll } from '@ui/hooks/useRevealOnScroll'
import styles from './Reveal.module.css'

interface RevealProps {
  readonly children: ReactNode
  /** Rendered element. Defaults to a `div`, but sections pass `article`, `li`, … */
  readonly as?: ElementType | undefined
  /** Stagger, in milliseconds, for items revealed as a group. */
  readonly delay?: number | undefined
  readonly className?: string | undefined
}

/**
 * Entrance animation as a composable wrapper instead of a global querySelector
 * pass: each instance owns its observer and its own visibility, so adding a
 * section never means remembering to register it somewhere else.
 */
export const Reveal = ({ children, as: Tag = 'div', delay = 0, className }: RevealProps) => {
  const { ref, visible } = useRevealOnScroll<HTMLElement>()
  const classes = [styles.reveal, visible ? styles.visible : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref} className={classes} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}
