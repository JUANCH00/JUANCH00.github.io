import type { Note } from '@domain/profile'
import { useProfile } from '@application/profile'
import { Reveal, Section } from '@ui/primitives'
import styles from './NotesSection.module.css'

const NoteContent = ({ note, published }: { readonly note: Note; readonly published: boolean }) => (
  <>
    <span className={styles.category}>{note.category}</span>
    <h3 className={styles.title}>{note.title}</h3>
    <span className={styles.status}>{published ? 'Read →' : 'In progress'}</span>
  </>
)

/**
 * Notes are a compact list, not a grid of identical cards promising content
 * that does not exist yet. A note only becomes a link once it has somewhere to
 * go: an unpublished one renders as an `article`, never as an `<a href="#">`
 * that lies to the visitor and traps a keyboard user on a dead link.
 */
export const NotesSection = () => {
  const { notes } = useProfile()

  return (
    <Section id="notes" title="Notes">
      <ul className={styles.list}>
        {notes.map((note, index) => (
          <Reveal as="li" key={note.id} delay={index * 80}>
            {note.url ? (
              <a
                className={`${styles.note} ${styles.published}`}
                href={note.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <NoteContent note={note} published />
              </a>
            ) : (
              <article className={styles.note}>
                <NoteContent note={note} published={false} />
              </article>
            )}
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
