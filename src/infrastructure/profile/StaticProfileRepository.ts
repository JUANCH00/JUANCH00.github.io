import type { Profile, ProfileRepository } from '@domain/profile'
import { staticProfile } from './staticProfile.data'

/**
 * Adapter that satisfies `ProfileRepository` from a compiled-in constant.
 *
 * The content ships inside the bundle, so the site has no runtime dependency,
 * no request waterfall and no loading state — the right trade-off for a
 * portfolio whose content changes a few times a year.
 */
export class StaticProfileRepository implements ProfileRepository {
  constructor(private readonly profile: Profile = staticProfile) {}

  getProfile(): Profile {
    return this.profile
  }
}
