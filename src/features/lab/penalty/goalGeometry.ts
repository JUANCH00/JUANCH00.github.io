import { GOAL_COLUMNS, GOAL_ROWS, isValidCell, type GoalCell } from '@domain/lab'

/**
 * Where things sit inside the pitch, as percentages of the pitch box.
 *
 * Positions are computed, not measured: no `getBoundingClientRect`, no layout
 * read on every shot, and the same numbers hold at any pitch size. That also
 * makes the geometry a pure function, so it is unit-tested rather than
 * eyeballed in a browser, including the rule that matters most: a save must
 * look like a save.
 */
export const PITCH = {
  /** Empty strip on each side of the goal frame. */
  sideInsetPct: 8,
  /** Space above the crossbar. */
  topInsetPct: 5.334,
  /** The ground strip the goal stands on. */
  groundPct: 24.666,
} as const

/**
 * Sizes in rem, the unit the stylesheet uses, so zoom and the root font size
 * scale the pitch and everything on it together. The pitch's height is fixed;
 * its width follows the card. The stylesheet receives these values as custom
 * properties, so CSS and these calculations cannot drift apart.
 */
export const SIZES_REM = {
  pitchHeight: 18.75,
  keeperWidth: 4.5,
  keeperHeight: 7,
  ball: 1.25,
} as const

/** A centre point, in percentages of the pitch: from the left, from the bottom. */
export interface CellPosition {
  readonly leftPct: number
  readonly bottomPct: number
}

const frameWidthPct = 100 - PITCH.sideInsetPct * 2
const frameHeightPct = 100 - PITCH.topInsetPct - PITCH.groundPct

/** The keeper's height as a share of the pitch's height. */
export const KEEPER_HEIGHT_PCT = (SIZES_REM.keeperHeight / SIZES_REM.pitchHeight) * 100

const assertCell = (cell: GoalCell) => {
  if (!isValidCell(cell)) {
    throw new RangeError(`Cell ${cell} is outside the goal grid`)
  }
}

/** The centre of a cell: where the ball lands when it is shot there. */
export const cellPosition = (cell: GoalCell): CellPosition => {
  assertCell(cell)

  const column = cell % GOAL_COLUMNS
  const row = Math.floor(cell / GOAL_COLUMNS)
  const rowHeightPct = frameHeightPct / GOAL_ROWS

  return {
    leftPct: PITCH.sideInsetPct + ((column + 0.5) * frameWidthPct) / GOAL_COLUMNS,
    // Rows are numbered top-down; `bottom` grows upward, hence the inversion.
    bottomPct: PITCH.groundPct + (GOAL_ROWS - 1 - row + 0.5) * rowHeightPct,
  }
}

/** The ball waits on the penalty spot, in the middle of the ground strip. */
export const BALL_REST: CellPosition = { leftPct: 50, bottomPct: PITCH.groundPct / 2 }

/** The keeper waits in the middle of the goal with its feet on the line. */
export const KEEPER_REST: CellPosition = {
  leftPct: 50,
  bottomPct: PITCH.groundPct + KEEPER_HEIGHT_PCT / 2,
}

/**
 * Where the keeper's centre goes when it dives for a cell: onto the centre of
 * that cell, high or low. On a save that is exactly where the ball lands, so
 * the keeper covers it in the top corners too. It used to stay on the line,
 * and a "saved" top-corner shot flew visibly over its head.
 */
export const keeperDive = (cell: GoalCell): CellPosition => cellPosition(cell)

/** The keeper leans into a dive to either side: degrees, clockwise. */
export const keeperTilt = (cell: GoalCell): number => {
  assertCell(cell)
  const column = cell % GOAL_COLUMNS
  if (column === 0) return -12
  if (column === GOAL_COLUMNS - 1) return 12
  return 0
}

export const cellLabel = (cell: GoalCell): string => {
  const columns = ['left', 'centre', 'right'] as const
  const rows = ['top', 'bottom'] as const
  const column = columns[cell % GOAL_COLUMNS] ?? 'centre'
  const row = rows[Math.floor(cell / GOAL_COLUMNS)] ?? 'top'
  return `${row} ${column}`
}
