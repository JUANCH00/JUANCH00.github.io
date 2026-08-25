import { GOAL_COLUMNS, GOAL_ROWS, isValidCell, type GoalCell } from '@domain/lab'

/**
 * Where things sit inside the pitch, as percentages of the pitch box.
 *
 * Positions are computed, not measured: no `getBoundingClientRect`, no layout
 * read on every shot, and the same numbers hold at any pitch size. That also
 * makes the geometry a pure function, so it is unit-tested rather than
 * eyeballed in a browser.
 */
export const PITCH = {
  /** Empty strip on each side of the goal frame. */
  sideInsetPct: 8,
  /** Space above the crossbar. */
  topInsetPct: 5.334,
  /** The ground strip the keeper stands on. */
  groundPct: 24.666,
  /** Resting height of the ball, from the bottom of the pitch. */
  ballRestPct: 6.666,
} as const

export interface CellPosition {
  readonly leftPct: number
  readonly bottomPct: number
}

const frameWidthPct = 100 - PITCH.sideInsetPct * 2
const frameHeightPct = 100 - PITCH.topInsetPct - PITCH.groundPct

export const cellPosition = (cell: GoalCell): CellPosition => {
  if (!isValidCell(cell)) {
    throw new RangeError(`Cell ${cell} is outside the goal grid`)
  }

  const column = cell % GOAL_COLUMNS
  const row = Math.floor(cell / GOAL_COLUMNS)
  const rowHeightPct = frameHeightPct / GOAL_ROWS

  return {
    leftPct: PITCH.sideInsetPct + ((column + 0.5) * frameWidthPct) / GOAL_COLUMNS,
    // Rows are numbered top-down; `bottom` grows upward, hence the inversion.
    bottomPct: PITCH.groundPct + (GOAL_ROWS - 1 - row + 0.5) * rowHeightPct,
  }
}

export const BALL_REST: CellPosition = { leftPct: 50, bottomPct: PITCH.ballRestPct }
export const KEEPER_REST: CellPosition = { leftPct: 50, bottomPct: PITCH.groundPct }

/** The keeper dives sideways and drops when going for a low ball. */
export const keeperDive = (cell: GoalCell): CellPosition => ({
  leftPct: cellPosition(cell).leftPct,
  bottomPct: PITCH.groundPct + (cell < GOAL_COLUMNS ? 3 : -4),
})

export const cellLabel = (cell: GoalCell): string => {
  const columns = ['left', 'centre', 'right'] as const
  const rows = ['top', 'bottom'] as const
  const column = columns[cell % GOAL_COLUMNS] ?? 'centre'
  const row = rows[Math.floor(cell / GOAL_COLUMNS)] ?? 'top'
  return `${row} ${column}`
}
