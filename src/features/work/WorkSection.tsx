import { useProfile } from '@application/profile'
import { Reveal, Section } from '@ui/primitives'
import { ProjectRow } from './ProjectRow'
import styles from './WorkSection.module.css'

export const WorkSection = () => {
  const { projects, links } = useProfile()

  return (
    <Section
      id="work"
      title="Projects"
      count={projects.length}
      aside={
        <a href={links.repositories} target="_blank" rel="noreferrer noopener">
          All repos on GitHub →
        </a>
      }
    >
      <div className={styles.list}>
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 80}>
            <ProjectRow project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
