import { StrictMode, type ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FLIGHT_MS, RESET_MS, usePenaltyGame } from './usePenaltyGame'

/**
 * Render the way src/main.tsx does. StrictMode runs state updaters twice on
 * purpose, which is exactly what exposed the old bug: the random draw and the
 * timers lived inside an updater, so one click could count twice.
 */
const strict = ({ children }: { readonly children: ReactNode }) => (
  <StrictMode>{children}</StrictMode>
)

/** Draws below 0.54 are saves at 54% accuracy; a goal also draws the keeper's cell. */
const SAVE = 0.1
const GOAL = 0.9

const setup = (...draws: number[]) => {
  const random = vi.fn<() => number>()
  for (const draw of draws) random.mockReturnValueOnce(draw)
  random.mockReturnValue(GOAL)
  const view = renderHook(() => usePenaltyGame({ accuracy: 54, random }), { wrapper: strict })
  return { random, ...view }
}

describe('usePenaltyGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('draws once and scores a save exactly once', () => {
    const { random, result } = setup(SAVE)

    act(() => result.current.shoot(2))
    expect(random).toHaveBeenCalledTimes(1)
    expect(result.current).toMatchObject({ status: 'guessing', ballCell: 2, keeperCell: 2 })

    act(() => {
      vi.advanceTimersByTime(FLIGHT_MS)
    })
    expect(result.current.state).toMatchObject({ goals: 0, saves: 1 })
    expect(result.current.status).toBe('saved')

    act(() => {
      vi.advanceTimersByTime(RESET_MS)
    })
    expect(result.current.state).toMatchObject({ goals: 0, saves: 1, phase: 'idle', shot: null })
    expect(result.current.canShoot).toBe(true)
  })

  it('scores a goal once, with the keeper in another cell', () => {
    // Goal, then the keeper's offset: 0 means the next cell over.
    const { random, result } = setup(GOAL, 0)

    act(() => result.current.shoot(0))
    expect(random).toHaveBeenCalledTimes(2)
    expect(result.current).toMatchObject({ ballCell: 0, keeperCell: 1 })

    act(() => {
      vi.advanceTimersByTime(FLIGHT_MS)
    })
    expect(result.current.state).toMatchObject({ goals: 1, saves: 0 })
    expect(result.current.status).toBe('scored')
  })

  it('ignores a double click and clicks while the result is on screen', () => {
    const { random, result } = setup(SAVE)

    act(() => {
      result.current.shoot(0)
      result.current.shoot(4)
    })
    expect(random).toHaveBeenCalledTimes(1)
    expect(result.current.ballCell).toBe(0)

    act(() => {
      vi.advanceTimersByTime(FLIGHT_MS)
    })
    expect(result.current.canShoot).toBe(false)
    act(() => result.current.shoot(5))

    act(() => {
      vi.advanceTimersByTime(RESET_MS)
    })
    expect(random).toHaveBeenCalledTimes(1)
    expect(result.current.state).toMatchObject({ goals: 0, saves: 1 })
  })

  it('keeps count across shots', () => {
    const { result } = setup(SAVE, GOAL, 0, SAVE)

    for (const cell of [1, 3, 5]) {
      act(() => result.current.shoot(cell))
      act(() => {
        vi.advanceTimersByTime(FLIGHT_MS + RESET_MS)
      })
    }

    expect(result.current.state).toMatchObject({ goals: 1, saves: 2, phase: 'idle' })
  })

  it('stops its timers when the lab goes away mid-shot', () => {
    const { result, unmount } = setup(SAVE)

    act(() => result.current.shoot(1))
    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
