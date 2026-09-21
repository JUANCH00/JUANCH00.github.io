import type { Profile, ProfileRepository } from '@domain/profile'

/**
 * A complete but obviously fake profile. Component tests assert against these
 * values, so a test can never accidentally pass because the real content
 * happens to contain the string it was looking for.
 */
export const fakeProfile: Profile = {
  identity: {
    firstName: 'Test',
    lastName: 'Person',
    displayLines: ['Test', 'Person'],
    title: 'Test title',
    location: 'Testville',
  },
  summary: ['A short lead sentence for the hero.'],
  stackTicker: ['Alpha', 'Beta'],
  projects: [
    {
      id: 'project-one',
      name: 'Project One',
      metric: '99% accuracy',
      context: 'Test context',
      summary: 'A project summary long enough to look like a real one in the layout.',
      tags: ['Alpha'],
      repositoryUrl: 'https://github.com/example/project-one',
    },
  ],
  experience: [
    {
      id: 'job-one',
      organization: 'Example Org',
      role: 'Test role',
      location: 'Remote',
      period: '2024 — 2025',
      highlights: ['Did a testable thing.'],
    },
  ],
  skillGroups: [{ id: 'group-one', title: 'Group One', skills: ['Alpha', 'Beta'] }],
  notes: [
    { id: 'note-draft', category: 'Testing', title: 'An unpublished note', status: 'writing' },
    {
      id: 'note-live',
      category: 'Testing',
      title: 'A published note',
      status: 'published',
      url: 'https://example.com/note',
    },
  ],
  contactChannels: [
    {
      id: 'social',
      kind: 'social',
      label: 'Social',
      links: [{ id: 'github', text: 'GitHub', href: 'https://github.com/example' }],
    },
  ],
  availability: {
    status: 'Open to internships',
    startsOn: 'January 2027',
    arrangement: 'Remote',
  },
  email: 'test@example.com',
  cvUrl: '/cv/test.pdf',
  links: {
    github: 'https://github.com/example',
    linkedin: 'https://linkedin.com/in/example',
    repositories: 'https://github.com/example?tab=repositories',
    sourceRepository: 'https://github.com/example/site',
  },
  lab: { modelAccuracy: 54, clusterSize: 3 },
}

export class FakeProfileRepository implements ProfileRepository {
  constructor(private readonly profile: Profile = fakeProfile) {}
  getProfile(): Profile {
    return this.profile
  }
}
