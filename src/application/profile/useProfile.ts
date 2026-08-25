import { use } from 'react'
import type { Profile } from '@domain/profile'
import { ProfileContext } from './ProfileContext'

export const useProfile = (): Profile => {
  const profile = use(ProfileContext)
  if (!profile) {
    throw new Error('useProfile must be called inside a <ProfileProvider>')
  }
  return profile
}
