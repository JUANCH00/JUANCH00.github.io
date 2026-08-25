import { describe, expect, it } from 'vitest'
import { GOAL_CELL_COUNT } from '@domain/lab'
import { BALL_REST, PITCH, cellLabel, cellPosition, keeperDive } from './goalGeometry'

const cells = Array.from({ length: GOAL_CELL_COUNT }, (_, index) => index)

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
  })
})

describe('keeperDive', () => {
  it('follows the horizontal position of the cell', () => {
    for (const cell of cells) {
      expect(keeperDive(cell).leftPct).toBeCloseTo(cellPosition(cell).leftPct, 5)
    }
  })

  it('stays near the goal line rather than floating up to the ball', () => {
    for (const cell of cells) {
      expect(Math.abs(keeperDive(cell).bottomPct - PITCH.groundPct)).toBeLessThanOrEqual(5)
    }
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
