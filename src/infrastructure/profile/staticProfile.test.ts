import { describe, expect, it } from 'vitest'
import { StaticProfileRepository } from './StaticProfileRepository'
import { staticProfile } from './staticProfile.data'

const profile = new StaticProfileRepository().getProfile()

const uniqueIds = (items: readonly { id: string }[]) => new Set(items.map((item) => item.id)).size

/**
 * Content invariants.
 *
 * These are the mistakes a portfolio actually ships with: a dead link, a
 * duplicated key that makes React drop a card, a project with no repository. A
 * type cannot catch them, so a test does — once, for all content at a time.
 */
describe('the published profile', () => {
  it('is the profile the repository serves', () => {
    expect(profile).toBe(staticProfile)
  })

  it('gives every collection unique ids', () => {
    expect(uniqueIds(profile.projects)).toBe(profile.projects.length)
    expect(uniqueIds(profile.experience)).toBe(profile.experience.length)
    expect(uniqueIds(profile.skillGroups)).toBe(profile.skillGroups.length)
    expect(uniqueIds(profile.notes)).toBe(profile.notes.length)
    expect(uniqueIds(profile.contactChannels)).toBe(profile.contactChannels.length)
  })

  it('points every project at a real GitHub repository', () => {
    for (const project of profile.projects) {
      expect(project.repositoryUrl, project.name).toMatch(
        /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/,
      )
      expect(project.tags.length, `${project.name} tags`).toBeGreaterThan(0)
      expect(project.summary.length, `${project.name} summary`).toBeGreaterThan(40)
    }
  })

  it('uses https for every external link', () => {
    const external: readonly string[] = [
      ...Object.values({ ...profile.links }),
      ...profile.contactChannels
        .flatMap((channel) => channel.links)
        .map((link) => link.href)
        .filter((href): href is string => typeof href === 'string' && !href.startsWith('tel:')),
    ]
    for (const href of external) {
      expect(href).toMatch(/^https:\/\//)
    }
  })

  it('keeps the highlighted phrase inside the lead paragraph', () => {
    expect(profile.summary[0]).toContain(profile.leadHighlight)
  })

  it('describes a lab that matches the projects', () => {
    expect(profile.lab.modelAccuracy).toBeGreaterThan(0)
    expect(profile.lab.modelAccuracy).toBeLessThanOrEqual(100)
    expect(profile.lab.clusterSize).toBeGreaterThanOrEqual(2)
  })

  it('links a downloadable CV', () => {
    expect(profile.cvUrl).toMatch(/\.pdf$/)
  })

  it('only marks a note as published when it has somewhere to link', () => {
    for (const note of profile.notes) {
      if (note.status === 'published') expect(note.url, note.title).toBeTruthy()
    }
  })
})
