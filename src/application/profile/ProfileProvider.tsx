import { useMemo, type ReactNode } from 'react'
import type { ProfileRepository } from '@domain/profile'
import { ProfileContext } from './ProfileContext'

interface ProfileProviderProps {
  readonly repository: ProfileRepository
  readonly children: ReactNode
}

/**
 * Dependency injection boundary: the provider receives a repository rather than
 * importing one, so tests can render any subtree against a fake profile and the
 * production wiring stays in the composition root (`src/app/App.tsx`).
 */
export const ProfileProvider = ({ repository, children }: ProfileProviderProps) => {
  const profile = useMemo(() => repository.getProfile(), [repository])
  return <ProfileContext value={profile}>{children}</ProfileContext>
}
