import type { CSSProperties } from 'react'
import { splitHighlight } from '@domain/profile'
import { useProfile } from '@application/profile'
import { Container, Marquee } from '@ui/primitives'
import { MAIN_CONTENT_ID } from '@app/navigation'
import styles from './Hero.module.css'

export const Hero = () => {
  const { identity, summary, leadHighlight, kicker, availability, stackTicker, cvUrl } =
    useProfile()
  const lead = splitHighlight(summary[0] ?? '', leadHighlight)

  return (
    <>
      <Container
        as="section"
        id={MAIN_CONTENT_ID}
        className={styles.hero}
        aria-labelledby="hero-name"
      >
        <p className={styles.meta}>
          <span>Systems Engineering — UPTC</span>
          <span>Machine learning / backend</span>
          <span className={styles.status}>◉ {availability.status}</span>
        </p>

        <h1 id="hero-name" className={styles.name}>
          {identity.displayLines.map((line, index) => (
            <span key={line} className={styles.line}>
              <span style={{ '--line-delay': `${index * 100}ms` } as CSSProperties}>{line}</span>
            </span>
          ))}
        </h1>

        <div className={styles.intro}>
          <p className={styles.lead}>
            {lead.map((segment, index) =>
              segment.highlighted ? (
                <span key={index} className={styles.leadAccent}>
                  {segment.text}
                </span>
              ) : (
                <span key={index}>{segment.text}</span>
              ),
            )}
          </p>
          <p className={styles.kicker}>{kicker[0]}</p>
          <div className={styles.actions}>
            <a className={`${styles.action} ${styles.primary}`} href="#work">
              See the work ↓
            </a>
            <a className={styles.action} href={cvUrl} download>
              Download CV (PDF)
            </a>
          </div>
        </div>
      </Container>

      <Container>
        <Marquee items={stackTicker} label="Stack" />
      </Container>
    </>
  )
}
