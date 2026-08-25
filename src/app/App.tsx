import type { ProfileRepository } from '@domain/profile'
import { ProfileProvider } from '@application/profile'
import { PointerHalo } from '@ui/effects/PointerHalo'
import { SkipLink } from '@ui/primitives'
import { NavBar } from '@features/navigation/NavBar'
import { Hero } from '@features/hero/Hero'
import { WorkSection } from '@features/work/WorkSection'
import { ExperienceSection } from '@features/experience/ExperienceSection'
import { LabSection } from '@features/lab/LabSection'
import { StackSection } from '@features/stack/StackSection'
import { NotesSection } from '@features/notes/NotesSection'
import { ContactSection } from '@features/contact/ContactSection'
import { SiteFooter } from '@features/contact/SiteFooter'
import { ErrorBoundary } from './ErrorBoundary'
import { MAIN_CONTENT_ID } from './navigation'
import styles from './App.module.css'

/**
 * Composition root.
 *
 * The repository arrives as a prop rather than being imported here, so this
 * component — and every section under it — can be rendered in a test against a
 * fake profile with no module mocking at all.
 */
export const App = ({ repository }: { readonly repository: ProfileRepository }) => (
  <ProfileProvider repository={repository}>
    <SkipLink targetId={MAIN_CONTENT_ID} />
    <PointerHalo />
    <NavBar />
    <main className={styles.main}>
      <Hero />
      <WorkSection />
      <ExperienceSection />
      <ErrorBoundary
        fallback={
          <p className={styles.labFallback}>
            The interactive lab could not start in this browser. Everything it demonstrates is
            described in the projects above.
          </p>
        }
      >
        <LabSection />
      </ErrorBoundary>
      <StackSection />
      <NotesSection />
      <ContactSection />
    </main>
    <SiteFooter />
  </ProfileProvider>
)
