import type { Profile } from './profile.types'

/**
 * Port (in the hexagonal-architecture sense) through which the application
 * obtains profile content.
 *
 * The UI depends on this interface, never on a concrete source. Today the only
 * adapter reads a typed constant (`StaticProfileRepository`); swapping in a CMS
 * or a `fetch` against an API means writing one new adapter and changing one
 * line in the composition root — no component changes.
 */
export interface ProfileRepository {
  getProfile(): Profile
}
