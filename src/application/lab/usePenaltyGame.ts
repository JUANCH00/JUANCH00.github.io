import { useCallback, useEffect, useRef, useState } from 'react'
import {
  applyShot,
  canShoot,
  initialPenaltyState,
  readyForNextShot,
  resolveShot,
  startShot,
  type GoalCell,
  type PenaltyState,
  type RandomSource,
  type ShotOutcome,
} from '@domain/lab'

/** How long the ball is in the air before the outcome is scored. */
const FLIGHT_MS = 480
/** How long the result stays on screen before the pitch resets. */
const RESET_MS = 1100

export type PenaltyStatus = 'ready' | 'guessing' | 'saved' | 'scored'

export interface PenaltyGame {
  readonly state: PenaltyState
  readonly status: PenaltyStatus
  readonly keeperCell: GoalCell | null
  readonly ballCell: GoalCell | null
  readonly shoot: (cell: GoalCell) => void
}

interface Options {
  readonly accuracy: number
  /** Overridable for deterministic tests. */
  readonly random?: RandomSource
}

const statusOf = (state: PenaltyState): PenaltyStatus => {
  if (state.phase === 'shooting') return 'guessing'
  if (state.phase === 'resolved' && state.lastShot) return state.lastShot.saved ? 'saved' : 'scored'
  return 'ready'
}

/**
 * React binding for the penalty rules in `@domain/lab`.
 *
 * The hook owns only what is genuinely a UI concern — timers and the
 * in-flight positions used for the animation. Scoring lives in the domain,
 * where it is tested without rendering anything.
 */
export const usePenaltyGame = ({ accuracy, random = Math.random }: Options): PenaltyGame => {
  const [state, setState] = useState<PenaltyState>(initialPenaltyState)
  const [pending, setPending] = useState<ShotOutcome | null>(null)
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
      setState((current) => {
        if (!canShoot(current)) return current

        const outcome = resolveShot(cell, accuracy, random)
        setPending(outcome)

        timers.current.push(
          setTimeout(() => {
            setState((s) => applyShot(s, outcome))
            timers.current.push(
              setTimeout(() => {
                setPending(null)
                setState(readyForNextShot)
              }, RESET_MS),
            )
          }, FLIGHT_MS),
        )

        return startShot(current)
      })
    },
    [accuracy, random],
  )

  return {
    state,
    status: statusOf(state),
    keeperCell: pending?.keeperCell ?? null,
    ballCell: pending?.targetCell ?? null,
    shoot,
  }
}
