import { Fragment, type CSSProperties } from 'react'
import { useProfile } from '@application/profile'
import { ButtonLink, Container, Marquee } from '@ui/primitives'
import { MAIN_CONTENT_ID } from '@app/navigation'
import styles from './Hero.module.css'

/**
 * The first viewport holds four things and nothing else: availability, the
 * name, one sentence, two actions. Everything else on the page is one scroll
 * away, and the primary action has to be visible without that scroll on a
 * laptop and on a phone.
 */
export const Hero = () => {
  const { identity, summary, availability, stackTicker, cvUrl } = useProfile()

  return (
    <>
      <Container
        as="section"
        id={MAIN_CONTENT_ID}
        className={styles.hero}
        aria-labelledby="hero-name"
      >
        <p className={styles.status}>
          {availability.status}, {availability.startsOn}
        </p>

        <h1 id="hero-name" className={styles.name}>
          {identity.displayLines.map((line, index) => (
            <Fragment key={line}>
              {/* A real space between lines, so the heading reads as a name, not "EstebanMoreno". */}
              {index > 0 && ' '}
              <span className={styles.line}>
                <span style={{ '--line-delay': `${index * 100}ms` } as CSSProperties}>{line}</span>
              </span>
            </Fragment>
          ))}
        </h1>

        <div className={styles.intro}>
          <p className={styles.lead}>{summary[0]}</p>
          <div className={styles.actions}>
            <ButtonLink variant="primary" href="#work">
              See projects ↓
            </ButtonLink>
            <ButtonLink href={cvUrl} download>
              Download CV
            </ButtonLink>
          </div>
        </div>
      </Container>

      <Container>
        <Marquee items={stackTicker} label="Stack" />
      </Container>
    </>
  )
}
