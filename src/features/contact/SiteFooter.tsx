import { useProfile } from '@application/profile'
import { useLocalTime } from '@ui/hooks/useLocalTime'
import { Container } from '@ui/primitives'
import styles from './SiteFooter.module.css'

export const SiteFooter = () => {
  const { identity, links } = useProfile()
  const time = useLocalTime(identity.timeZone)

  return (
    <Container as="footer" className={styles.footer}>
      <span>
        {identity.location} — <time>{time}</time>
      </span>
      <span>
        Built with React, TypeScript and too much coffee ·{' '}
        <a href={links.sourceRepository} target="_blank" rel="noreferrer noopener">
          Source
        </a>
      </span>
    </Container>
  )
}
