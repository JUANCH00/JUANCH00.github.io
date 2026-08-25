import { useProfile } from '@application/profile'
import { useLocalTime } from '@ui/hooks/useLocalTime'
import { MAIN_CONTENT_ID, SECTIONS } from '@app/navigation'
import styles from './NavBar.module.css'

export const NavBar = () => {
  const { identity } = useProfile()
  const time = useLocalTime(identity.timeZone)

  return (
    <nav className={styles.nav} aria-label="Primary">
      <a className={styles.brand} href={`#${MAIN_CONTENT_ID}`}>
        J.E.M. ⌁ 2027
      </a>
      <div className={styles.links}>
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </div>
      {/* Polite, not assertive: the clock must never interrupt a screen reader. */}
      <span className={styles.clock} aria-live="off">
        <time>{time}</time> Tunja
      </span>
    </nav>
  )
}
