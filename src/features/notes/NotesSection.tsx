import type { Note } from '@domain/profile'
import { useProfile } from '@application/profile'
import { Reveal, Section } from '@ui/primitives'
import styles from './NotesSection.module.css'

const NoteBody = ({ note, index }: { readonly note: Note; readonly index: number }) => (
  <>
    <span className={styles.category}>
      {String(index + 1).padStart(2, '0')} / {note.category}
    </span>
    <h3 className={styles.title}>{note.title}</h3>
    {note.status === 'writing' && (
      <span className={styles.status}>Writing — not published yet</span>
    )}
  </>
)

/**
 * A note only becomes a link once it has somewhere to go. An unpublished note
 * renders as an `article`, not an `<a href="#">` that lies to the visitor and
 * traps a keyboard user on a link that does nothing.
 */
export const NotesSection = () => {
  const { notes } = useProfile()

  return (
    <Section id="notes" title="Notes" label="Technical notes — in progress">
      <div className={styles.grid}>
        {notes.map((note, index) =>
          note.url ? (
            <Reveal key={note.id} delay={index * 80}>
              <a className={styles.note} href={note.url} target="_blank" rel="noreferrer noopener">
                <NoteBody note={note} index={index} />
              </a>
            </Reveal>
          ) : (
            <Reveal as="article" key={note.id} delay={index * 80} className={styles.note}>
              <NoteBody note={note} index={index} />
            </Reveal>
          ),
        )}
      </div>
    </Section>
  )
}
