import { useCallback, useEffect, useRef, useState } from 'react'
import {
  canShoot,
  initialPenaltyState,
  readyForNextShot,
  resolveShot,
  scoreShot,
  startShot,
  type GoalCell,
  type PenaltyState,
  type RandomSource,
} from '@domain/lab'

/** How long the ball is in the air before the outcome is scored. */
export const FLIGHT_MS = 480
/** How long the result stays on screen before the pitch resets. */
export const RESET_MS = 1100

export type PenaltyStatus = 'ready' | 'guessing' | 'saved' | 'scored'

export interface PenaltyGame {
  readonly state: PenaltyState
  readonly status: PenaltyStatus
  /** False while a shot is in the air or its result is on screen. */
  readonly canShoot: boolean
  readonly keeperCell: GoalCell | null
  readonly ballCell: GoalCell | null
  readonly shoot: (cell: GoalCell) => void
}

interface Options {
  readonly accuracy: number
  /** Overridable for deterministic tests. */
  readonly random?: RandomSource
}

const statusOf = ({ phase, shot }: PenaltyState): PenaltyStatus => {
  if (phase === 'shooting') return 'guessing'
  if (phase === 'resolved' && shot) return shot.saved ? 'saved' : 'scored'
  return 'ready'
}

/**
 * React binding for the penalty rules in `@domain/lab`.
 *
 * Side effects live in the click handler and nowhere else: the random draw
 * and the timers run exactly once per shot. They used to live inside a state
 * updater, which React is free to call more than once (and does, on purpose,
 * in development), so one click could score twice, not at all, or as a goal
 * and a save at the same time. Every updater passed to `setState` here is a
 * pure domain transition.
 */
export const usePenaltyGame = ({ accuracy, random = Math.random }: Options): PenaltyGame => {
  const [state, setState] = useState<PenaltyState>(initialPenaltyState)
  // Two clicks in the same frame both run before React re-renders, so the
  // "one ball at a time" guard cannot wait for state: it has to be a ref that
  // flips synchronously. The domain guards the same rule a second time.
  const shotInProgress = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    },
    [],
  )

  const shoot = useCallback(
    (cell: GoalCell) => {
      if (shotInProgress.current) return
      shotInProgress.current = true

      const shot = resolveShot(cell, accuracy, random)
      setState((current) => startShot(current, shot))

      timers.current = [
        setTimeout(() => setState(scoreShot), FLIGHT_MS),
        setTimeout(() => {
          shotInProgress.current = false
          setState(readyForNextShot)
        }, FLIGHT_MS + RESET_MS),
      ]
    },
    [accuracy, random],
  )

  return {
    state,
    status: statusOf(state),
    canShoot: canShoot(state),
    keeperCell: state.shot?.keeperCell ?? null,
    ballCell: state.shot?.targetCell ?? null,
    shoot,
  }
}
