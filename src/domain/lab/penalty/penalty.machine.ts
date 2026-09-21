import type { GoalCell, PenaltyState, RandomSource, ShotOutcome } from './penalty.types'

/** The goal is a 3-column x 2-row grid, matching the on-screen target. */
export const GOAL_COLUMNS = 3
export const GOAL_ROWS = 2
export const GOAL_CELL_COUNT = GOAL_COLUMNS * GOAL_ROWS

export const initialPenaltyState: PenaltyState = {
  goals: 0,
  saves: 0,
  phase: 'idle',
  shot: null,
}

/** Clamp an arbitrary number into the 0..100 range a percentage may occupy. */
export const clampAccuracy = (value: number): number => {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
}

export const isValidCell = (cell: number): boolean =>
  Number.isInteger(cell) && cell >= 0 && cell < GOAL_CELL_COUNT

/**
 * Decide the outcome of a shot.
 *
 * The keeper saves with exactly the model's validation accuracy, so the game is
 * a playable restatement of the real number. On a miss the keeper dives to some
 * *other* cell, chosen from the remaining ones — never to the ball's cell, which
 * would read on screen as a save that was scored as a goal.
 */
export const resolveShot = (
  targetCell: GoalCell,
  accuracy: number,
  random: RandomSource,
): ShotOutcome => {
  if (!isValidCell(targetCell)) {
    throw new RangeError(`Shot target ${targetCell} is outside the goal grid`)
  }

  const saved = random() < clampAccuracy(accuracy) / 100
  if (saved) {
    return { targetCell, keeperCell: targetCell, saved: true }
  }

  const offset = 1 + Math.floor(random() * (GOAL_CELL_COUNT - 1))
  const keeperCell = (targetCell + offset) % GOAL_CELL_COUNT
  return { targetCell, keeperCell, saved: false }
}

/**
 * Every transition below is a pure function that ignores calls from the wrong
 * phase. That makes each one safe to hand to React as a state updater, which
 * the framework may run more than once, and harmless if a stray timer fires
 * twice: a shot is taken once, scored once and cleared once.
 */

/** Put a shot in the air. Ignored unless the pitch is idle: one ball at a time. */
export const startShot = (state: PenaltyState, shot: ShotOutcome): PenaltyState =>
  state.phase === 'idle' ? { ...state, phase: 'shooting', shot } : state

/** Score the shot in the air, exactly once. */
export const scoreShot = (state: PenaltyState): PenaltyState => {
  if (state.phase !== 'shooting' || !state.shot) return state
  const { saved } = state.shot
  return {
    ...state,
    goals: saved ? state.goals : state.goals + 1,
    saves: saved ? state.saves + 1 : state.saves,
    phase: 'resolved',
  }
}

/** Clear the pitch after a scored shot, keeping the score. */
export const readyForNextShot = (state: PenaltyState): PenaltyState =>
  state.phase === 'resolved' ? { ...state, phase: 'idle', shot: null } : state

export const canShoot = (state: PenaltyState): boolean => state.phase === 'idle'

export const totalShots = (state: PenaltyState): number => state.goals + state.saves
