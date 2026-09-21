import type { PenaltyState } from '@domain/lab'
import type { PenaltyStatus } from '@application/lab'

const STATUS_TEXT: Record<PenaltyStatus, string> = {
  ready: 'Pick a corner',
  guessing: 'The model is guessing…',
  saved: 'Saved, the model called it',
  scored: 'Goal, outside the model',
}

/**
 * Wording for the penalty game. Like `clusterMessages.ts`, it lives in the UI
 * layer: the game reports a status, this file decides how to say it.
 */
export const penaltyStatusText = (status: PenaltyStatus): string => STATUS_TEXT[status]

export const scoreText = ({ goals, saves }: PenaltyState): string =>
  `Goals ${goals}, saves ${saves}`
