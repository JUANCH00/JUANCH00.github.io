import { createContext } from 'react'
import type { Profile } from '@domain/profile'

/**
 * `null` means "no provider above me", which `useProfile` turns into a loud
 * error instead of letting a component render with half a profile.
 */
export const ProfileContext = createContext<Profile | null>(null)
