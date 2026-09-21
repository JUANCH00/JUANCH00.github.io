import { useActiveSection } from '@ui/hooks/useActiveSection'
import { Container } from '@ui/primitives'
import { MAIN_CONTENT_ID, SECTIONS, SECTION_IDS } from '@app/navigation'
import styles from './NavBar.module.css'

export const NavBar = () => {
  const active = useActiveSection(SECTION_IDS)

  return (
    <nav className={styles.nav} aria-label="Primary">
      <Container className={styles.inner}>
        <a className={styles.brand} href={`#${MAIN_CONTENT_ID}`}>
          J.E.M.
        </a>
        <ul className={styles.links}>
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                className={styles.link}
                href={`#${section.id}`}
                aria-current={active === section.id ? 'true' : undefined}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  )
}
