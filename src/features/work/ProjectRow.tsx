import type { Project } from '@domain/profile'
import { TagList } from '@ui/primitives'
import styles from './ProjectRow.module.css'

/**
 * The whole row is one link. That keeps the hit target large, gives keyboard
 * users a single tab stop per project, and means the hover treatment and the
 * focus treatment are the same state — no interactive element is reachable by
 * mouse but invisible to the keyboard.
 */
export const ProjectRow = ({ project }: { readonly project: Project }) => (
  <a
    className={styles.row}
    href={project.repositoryUrl}
    target="_blank"
    rel="noreferrer noopener"
    aria-label={`${project.name}, ${project.metric}. Open the repository on GitHub.`}
  >
    {/* The inner block is what moves on hover: a transform, never padding,
        so the browser composites instead of re-running layout every frame. */}
    <div className={styles.inner}>
      <div className={styles.head}>
        <h3 className={styles.name}>{project.name}</h3>
        <span className={styles.metric}>{project.metric}</span>
        <span className={styles.context}>{project.context}</span>
      </div>
      <p className={styles.summary}>{project.summary}</p>
      <TagList items={project.tags} label={`${project.name} stack`} />
    </div>
  </a>
)
