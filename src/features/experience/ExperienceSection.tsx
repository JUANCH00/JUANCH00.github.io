import { useProfile } from '@application/profile'
import { Reveal, Section } from '@ui/primitives'
import styles from './ExperienceSection.module.css'

export const ExperienceSection = () => {
  const { experience, cvUrl } = useProfile()

  return (
    <Section
      id="experience"
      title="Experience"
      label="Experience — what I have actually shipped"
      aside={
        <a href={cvUrl} download>
          Full CV (PDF) →
        </a>
      }
    >
      <ul className={styles.list}>
        {experience.map((entry, index) => (
          <Reveal as="li" key={entry.id} delay={index * 80} className={styles.entry}>
            <div className={styles.period}>
              {entry.period}
              <span className={styles.location}>{entry.location}</span>
            </div>
            <div>
              <h3 className={styles.org}>{entry.organization}</h3>
              <p className={styles.role}>{entry.role}</p>
              <ul className={styles.highlights}>
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
