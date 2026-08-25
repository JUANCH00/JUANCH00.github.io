import { describe, expect, it } from 'vitest'
import {
  GOAL_CELL_COUNT,
  applyShot,
  canShoot,
  clampAccuracy,
  initialPenaltyState,
  isValidCell,
  readyForNextShot,
  resolveShot,
  startShot,
  totalShots,
} from './penalty.machine'

/** A random source that replays a fixed script, so every rule is deterministic. */
const scripted = (...values: number[]) => {
  let index = 0
  return () => values[index++] ?? 0
}

describe('clampAccuracy', () => {
  it('keeps a valid percentage untouched', () => {
    expect(clampAccuracy(54)).toBe(54)
  })

  it.each([
    [-10, 0],
    [140, 100],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
  ])('clamps %p to %p', (input, expected) => {
    expect(clampAccuracy(input)).toBe(expected)
  })
})

describe('isValidCell', () => {
  it('accepts every cell of the grid', () => {
    for (let cell = 0; cell < GOAL_CELL_COUNT; cell += 1) {
      expect(isValidCell(cell)).toBe(true)
    }
  })

  it.each([-1, GOAL_CELL_COUNT, 1.5, Number.NaN])('rejects %p', (cell) => {
    expect(isValidCell(cell)).toBe(false)
  })
})

describe('resolveShot', () => {
  it('saves when the draw falls under the accuracy', () => {
    // 0.2 < 0.54 → the keeper reads it right.
    expect(resolveShot(2, 54, scripted(0.2))).toEqual({
      targetCell: 2,
      keeperCell: 2,
      saved: true,
    })
  })

  it('concedes when the draw falls above the accuracy', () => {
    const outcome = resolveShot(2, 54, scripted(0.9, 0))
    expect(outcome.saved).toBe(false)
  })

  it('never sends the keeper to the ball on a goal', () => {
    for (let target = 0; target < GOAL_CELL_COUNT; target += 1) {
      for (const draw of [0, 0.25, 0.5, 0.75, 0.999]) {
        const outcome = resolveShot(target, 0, scripted(1, draw))
        expect(outcome.saved).toBe(false)
        expect(outcome.keeperCell).not.toBe(target)
        expect(isValidCell(outcome.keeperCell)).toBe(true)
      }
    }
  })

  it('always saves at 100% and never at 0%', () => {
    expect(resolveShot(0, 100, scripted(0.999)).saved).toBe(true)
    expect(resolveShot(0, 0, scripted(0)).saved).toBe(false)
  })

  it('rejects a shot outside the grid', () => {
    expect(() => resolveShot(GOAL_CELL_COUNT, 54, scripted(0))).toThrow(RangeError)
  })
})

describe('the shot lifecycle', () => {
  it('counts a goal and a save on the right side of the scoreboard', () => {
    const scored = applyShot(initialPenaltyState, { targetCell: 1, keeperCell: 4, saved: false })
    expect(scored).toMatchObject({ goals: 1, saves: 0, phase: 'resolved' })

    const saved = applyShot(scored, { targetCell: 1, keeperCell: 1, saved: true })
    expect(saved).toMatchObject({ goals: 1, saves: 1 })
    expect(totalShots(saved)).toBe(2)
  })

  it('refuses a second shot while one is in the air', () => {
    const shooting = startShot(initialPenaltyState)
    expect(canShoot(shooting)).toBe(false)
    expect(startShot(shooting)).toBe(shooting)
  })

  it('keeps the score when it resets for the next shot', () => {
    const resolved = applyShot(startShot(initialPenaltyState), {
      targetCell: 0,
      keeperCell: 3,
      saved: false,
    })
    const next = readyForNextShot(resolved)
    expect(next).toMatchObject({ goals: 1, phase: 'idle' })
    expect(canShoot(next)).toBe(true)
  })

  it('never mutates the state it is given', () => {
    const frozen = Object.freeze({ ...initialPenaltyState })
    applyShot(frozen, { targetCell: 0, keeperCell: 1, saved: false })
    expect(frozen.goals).toBe(0)
  })
})
