import { useProfile } from '@application/profile'
import { Reveal, Section } from '@ui/primitives'
import styles from './StackSection.module.css'

export const StackSection = () => {
  const { skillGroups } = useProfile()

  return (
    <Section id="stack" title="Stack">
      <div className={styles.grid}>
        {skillGroups.map((group, index) => (
          <Reveal key={group.id} delay={index * 80}>
            <h3 className={styles.title}>{group.title}</h3>
            <ul className={styles.skills}>
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
