import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Container.module.css'

type ContainerElement = 'div' | 'section' | 'footer' | 'header'

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element; landmarks pass their own so no wrapper div is added. */
  readonly as?: ContainerElement | undefined
  readonly children: ReactNode
}

/**
 * The page column: centred, capped at `--page-max`, with the fluid gutter on
 * both sides. Every full-width block renders through it, so the left edge of
 * the nav, the hero and each section line up at any viewport width instead of
 * running into the screen edges on a wide monitor.
 */
export const Container = ({ as: Tag = 'div', className, children, ...rest }: ContainerProps) => (
  <Tag className={className ? `${styles.container} ${className}` : styles.container} {...rest}>
    {children}
  </Tag>
)
