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
  /**
   * The shot in the air or on display: set when it is taken, scored when it
   * lands, cleared when the pitch resets. The animation and the scoreboard both
   * read this one value, so what the visitor sees and what gets counted cannot
   * disagree.
   */
  readonly shot: ShotOutcome | null
}

/** Injected source of randomness so every rule below can be tested deterministically. */
export type RandomSource = () => number
