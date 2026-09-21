import { describe, expect, it } from 'vitest'
import { initialPenaltyState } from '@domain/lab'
import type { PenaltyStatus } from '@application/lab'
import { penaltyStatusText, scoreText } from './penaltyMessages'

const statuses: readonly PenaltyStatus[] = ['ready', 'guessing', 'saved', 'scored']

describe('penalty wording', () => {
  it('has a line for every status', () => {
    expect(statuses.map(penaltyStatusText)).toEqual([
      'Pick a corner',
      'The model is guessing…',
      'Saved, the model called it',
      'Goal, outside the model',
    ])
  })

  it('reads the score as a sentence', () => {
    expect(scoreText({ ...initialPenaltyState, goals: 2, saves: 3 })).toBe('Goals 2, saves 3')
  })

  it('never uses a dash as punctuation', () => {
    for (const status of statuses) expect(penaltyStatusText(status)).not.toMatch(/[–—]/)
  })
})
