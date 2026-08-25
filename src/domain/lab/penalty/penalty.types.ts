/** Zero-based index of a cell in the 3x2 goal grid. */
export type GoalCell = number

export type PenaltyPhase = 'idle' | 'shooting' | 'resolved'

export interface ShotOutcome {
  readonly targetCell: GoalCell
  readonly keeperCell: GoalCell
  readonly saved: boolean
}

export interface PenaltyState {
  readonly goals: number
  readonly saves: number
  readonly phase: PenaltyPhase
  readonly lastShot: ShotOutcome | null
}

/** Injected source of randomness so every rule below can be tested deterministically. */
export type RandomSource = () => number
