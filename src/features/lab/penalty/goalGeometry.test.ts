import { describe, expect, it } from 'vitest'
import { GOAL_CELL_COUNT } from '@domain/lab'
import {
  BALL_REST,
  KEEPER_HEIGHT_PCT,
  KEEPER_REST,
  PITCH,
  SIZES_REM,
  cellLabel,
  cellPosition,
  keeperDive,
  keeperTilt,
  type CellPosition,
} from './goalGeometry'

const cells = Array.from({ length: GOAL_CELL_COUNT }, (_, index) => index)

// ---- The pitch in pixels, the way the browser draws it --------------------

const PX_PER_REM = 16
const HEIGHT = SIZES_REM.pitchHeight * PX_PER_REM
const KEEPER = { w: SIZES_REM.keeperWidth * PX_PER_REM, h: SIZES_REM.keeperHeight * PX_PER_REM }
const BALL_RADIUS = (SIZES_REM.ball * PX_PER_REM) / 2

/** Pitch widths the lab really renders at: a 320px phone, a 390px phone, a desktop card. */
const WIDTHS = [238, 308, 610]

interface Point {
  readonly x: number
  readonly y: number
}

/** Screen coordinates: x from the left, y from the top. */
const toScreen = ({ leftPct, bottomPct }: CellPosition, width: number): Point => ({
  x: (leftPct / 100) * width,
  y: HEIGHT - (bottomPct / 100) * HEIGHT,
})

/** A point in the keeper's own axes; the keeper is turned `tilt` degrees clockwise about its centre. */
const inKeeperFrame = (point: Point, keeper: Point, tiltDeg: number): Point => {
  const t = (tiltDeg * Math.PI) / 180
  const dx = point.x - keeper.x
  const dy = point.y - keeper.y
  return { x: dx * Math.cos(t) + dy * Math.sin(t), y: -dx * Math.sin(t) + dy * Math.cos(t) }
}

const ballHiddenBehindKeeper = (ball: Point) =>
  Math.abs(ball.x) + BALL_RADIUS <= KEEPER.w / 2 && Math.abs(ball.y) + BALL_RADIUS <= KEEPER.h / 2

const ballTouchesKeeper = (ball: Point) => {
  const nearestX = Math.max(-KEEPER.w / 2, Math.min(KEEPER.w / 2, ball.x))
  const nearestY = Math.max(-KEEPER.h / 2, Math.min(KEEPER.h / 2, ball.y))
  return (ball.x - nearestX) ** 2 + (ball.y - nearestY) ** 2 < BALL_RADIUS ** 2
}

const ballAgainstKeeper = (target: number, dive: number, width: number) =>
  inKeeperFrame(
    toScreen(cellPosition(target), width),
    toScreen(keeperDive(dive), width),
    keeperTilt(dive),
  )

// ---------------------------------------------------------------------------

describe('what the visitor sees matches the score', () => {
  it.each(WIDTHS)('a save hides the ball behind the keeper, corners included (%ipx)', (width) => {
    for (const cell of cells) {
      expect(ballHiddenBehindKeeper(ballAgainstKeeper(cell, cell, width)), cellLabel(cell)).toBe(
        true,
      )
    }
  })

  it.each(WIDTHS)('a goal never touches the keeper, wherever it dives (%ipx)', (width) => {
    for (const target of cells) {
      for (const dive of cells.filter((cell) => cell !== target)) {
        expect(
          ballTouchesKeeper(ballAgainstKeeper(target, dive, width)),
          `ball ${cellLabel(target)}, keeper ${cellLabel(dive)}`,
        ).toBe(false)
      }
    }
  })

  it.each(WIDTHS)('keeps the keeper on the pitch on every dive (%ipx)', (width) => {
    for (const cell of cells) {
      const centre = toScreen(keeperDive(cell), width)
      const t = (Math.abs(keeperTilt(cell)) * Math.PI) / 180
      const halfWidth = (KEEPER.w / 2) * Math.cos(t) + (KEEPER.h / 2) * Math.sin(t)
      const halfHeight = (KEEPER.w / 2) * Math.sin(t) + (KEEPER.h / 2) * Math.cos(t)

      expect(centre.x - halfWidth, cellLabel(cell)).toBeGreaterThanOrEqual(0)
      expect(centre.x + halfWidth, cellLabel(cell)).toBeLessThanOrEqual(width)
      expect(centre.y - halfHeight, cellLabel(cell)).toBeGreaterThanOrEqual(0)
      expect(centre.y + halfHeight, cellLabel(cell)).toBeLessThanOrEqual(HEIGHT)
    }
  })
})

describe('cellPosition', () => {
  it('keeps every cell inside the goal frame', () => {
    for (const cell of cells) {
      const { leftPct, bottomPct } = cellPosition(cell)
      expect(leftPct).toBeGreaterThan(PITCH.sideInsetPct)
      expect(leftPct).toBeLessThan(100 - PITCH.sideInsetPct)
      expect(bottomPct).toBeGreaterThan(PITCH.groundPct)
      expect(bottomPct).toBeLessThan(100 - PITCH.topInsetPct)
    }
  })

  it('orders the columns left to right', () => {
    expect(cellPosition(0).leftPct).toBeLessThan(cellPosition(1).leftPct)
    expect(cellPosition(1).leftPct).toBeLessThan(cellPosition(2).leftPct)
  })

  it('puts the top row above the bottom row', () => {
    for (let column = 0; column < 3; column += 1) {
      expect(cellPosition(column).bottomPct).toBeGreaterThan(cellPosition(column + 3).bottomPct)
    }
  })

  it('centres the middle column on the ball', () => {
    expect(cellPosition(1).leftPct).toBeCloseTo(BALL_REST.leftPct, 5)
  })

  it('rejects a cell outside the grid', () => {
    expect(() => cellPosition(GOAL_CELL_COUNT)).toThrow(RangeError)
    expect(() => keeperTilt(GOAL_CELL_COUNT)).toThrow(RangeError)
  })
})

describe('rest positions', () => {
  it('stands the keeper on the goal line, in the middle', () => {
    expect(KEEPER_REST.leftPct).toBe(50)
    expect(KEEPER_REST.bottomPct - KEEPER_HEIGHT_PCT / 2).toBeCloseTo(PITCH.groundPct, 5)
  })

  it('puts the ball on the spot, below the goal', () => {
    expect(BALL_REST.bottomPct).toBeLessThan(PITCH.groundPct)
  })
})

describe('keeperTilt', () => {
  it('leans into dives to either side and stands straight in the centre', () => {
    expect(cells.map(keeperTilt)).toEqual([-12, 0, 12, -12, 0, 12])
  })
})

describe('cellLabel', () => {
  it('names every corner for screen readers', () => {
    expect(cells.map(cellLabel)).toEqual([
      'top left',
      'top centre',
      'top right',
      'bottom left',
      'bottom centre',
      'bottom right',
    ])
  })
})
