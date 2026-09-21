import { useProfile } from '@application/profile'
import { Container } from '@ui/primitives'
import styles from './SiteFooter.module.css'

export const SiteFooter = () => {
  const { identity, links } = useProfile()

  return (
    <Container as="footer" className={styles.footer}>
      <span>{identity.location}</span>
      <span>
        Built with React, TypeScript and too much coffee ·{' '}
        <a href={links.sourceRepository} target="_blank" rel="noreferrer noopener">
          Source
        </a>
      </span>
    </Container>
  )
}
