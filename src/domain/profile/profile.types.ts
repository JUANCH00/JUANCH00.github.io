/**
 * Domain model for the portfolio.
 *
 * This file is intentionally free of React, DOM and framework types: it is the
 * vocabulary the rest of the application speaks, and it must stay portable.
 * Every field is `readonly` — the profile is data the UI renders, never mutates.
 */

/** Stable, human-readable identifier used as a React key and as an anchor id. */
export type EntityId = string

export interface Identity {
  readonly firstName: string
  readonly lastName: string
  /** Name split into the lines the hero types out, largest to smallest. */
  readonly displayLines: readonly string[]
  readonly title: string
  readonly location: string
  /** IANA time zone, used to render the local clock. */
  readonly timeZone: string
}

export interface Project {
  readonly id: EntityId
  readonly name: string
  /** Single fact that earns attention: "54% validation accuracy". */
  readonly metric: string
  readonly summary: string
  readonly tags: readonly string[]
  readonly repositoryUrl: string
  readonly context: string
}

export interface ExperienceEntry {
  readonly id: EntityId
  readonly organization: string
  readonly role: string
  readonly location: string
  readonly period: string
  readonly highlights: readonly string[]
}

export interface SkillGroup {
  readonly id: EntityId
  readonly title: string
  readonly skills: readonly string[]
}

export type NoteStatus = 'writing' | 'published'

export interface Note {
  readonly id: EntityId
  readonly category: string
  readonly title: string
  readonly status: NoteStatus
  /** Present only once the note is published. */
  readonly url?: string
}

export type ContactChannelKind = 'email' | 'phone' | 'social' | 'plain'

export interface ContactChannel {
  readonly id: EntityId
  readonly kind: ContactChannelKind
  readonly label: string
  readonly links: readonly ContactLink[]
}

export interface ContactLink {
  readonly id: EntityId
  readonly text: string
  readonly href?: string
}

export interface ProfileLinks {
  readonly github: string
  readonly linkedin: string
  readonly repositories: string
  /** This site's own repository — the source a reviewer is invited to read. */
  readonly sourceRepository: string
}

export interface Availability {
  readonly status: string
  readonly startsOn: string
  readonly arrangement: string
}

export interface LabConfig {
  /**
   * Accuracy of the World Cup classifier, in percent. The penalty game uses the
   * same number so the interaction is an honest demo of the model, not decoration.
   */
  readonly modelAccuracy: number
  readonly clusterSize: number
}

export interface Profile {
  readonly identity: Identity
  readonly summary: readonly string[]
  /** Phrase inside `summary[0]` the hero emphasises. See `splitHighlight`. */
  readonly leadHighlight: string
  readonly kicker: readonly string[]
  readonly stackTicker: readonly string[]
  readonly projects: readonly Project[]
  readonly experience: readonly ExperienceEntry[]
  readonly skillGroups: readonly SkillGroup[]
  readonly notes: readonly Note[]
  readonly contactChannels: readonly ContactChannel[]
  readonly availability: Availability
  readonly email: string
  readonly cvUrl: string
  readonly links: ProfileLinks
  readonly lab: LabConfig
}
