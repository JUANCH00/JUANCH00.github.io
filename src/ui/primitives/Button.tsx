import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'ghost'
export type ButtonSize = 'md' | 'sm'

interface Appearance {
  /** `primary` is the one action per view; everything else is `ghost`. */
  readonly variant?: ButtonVariant | undefined
  /** `sm` keeps the 44px touch target for dense controls such as the lab's. */
  readonly size?: ButtonSize | undefined
  readonly className?: string | undefined
  readonly children: ReactNode
}

const classesFor = ({ variant = 'ghost', size = 'md', className }: Omit<Appearance, 'children'>) =>
  [styles.button, variant === 'primary' && styles.primary, size === 'sm' && styles.sm, className]
    .filter(Boolean)
    .join(' ')

/** Something that happens on this page. Defaults to `type="button"`, never a stray submit. */
export const Button = ({
  variant,
  size,
  className,
  type = 'button',
  ...rest
}: Appearance & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type={type} className={classesFor({ variant, size, className })} {...rest} />
)

/**
 * Navigation or a download that looks like a button. It stays an `<a>`, so it
 * keeps link semantics: middle-click, "copy link", and the right role for
 * assistive technology.
 */
export const ButtonLink = ({
  variant,
  size,
  className,
  ...rest
}: Appearance & AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={classesFor({ variant, size, className })} {...rest} />
)
