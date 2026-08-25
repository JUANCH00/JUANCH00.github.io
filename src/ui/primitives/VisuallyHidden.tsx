import type { ReactNode } from 'react'
import styles from './VisuallyHidden.module.css'

/** Content for screen readers only — removed from view, never from the tree. */
export const VisuallyHidden = ({ children }: { readonly children: ReactNode }) => (
  <span className={styles.hidden}>{children}</span>
)
