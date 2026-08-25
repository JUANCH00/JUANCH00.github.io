import type { CSSProperties } from 'react'
import { GOAL_CELL_COUNT, type GoalCell } from '@domain/lab'
import { usePenaltyGame, type PenaltyStatus } from '@application/lab'
import { VisuallyHidden } from '@ui/primitives'
import { BALL_REST, KEEPER_REST, cellLabel, cellPosition, keeperDive } from './goalGeometry'
import styles from './PenaltyLab.module.css'

const MESSAGES: Record<PenaltyStatus, string> = {
  ready: 'pick a corner',
  guessing: 'the model is guessing…',
  saved: 'saved — the model called it',
  scored: 'goal — outside the model',
}

const place = ({ leftPct, bottomPct }: { leftPct: number; bottomPct: number }): CSSProperties =>
  ({ '--left': `${leftPct}%`, '--bottom': `${bottomPct}%` }) as CSSProperties

const cells: readonly GoalCell[] = Array.from({ length: GOAL_CELL_COUNT }, (_, index) => index)

/**
 * The keeper saves at exactly the validation accuracy of the GoalPredict model,
 * so playing this is the same as reading the number — only harder to forget.
 */
export const PenaltyLab = ({ accuracy }: { readonly accuracy: number }) => {
  const { state, status, keeperCell, ballCell, shoot } = usePenaltyGame({ accuracy })

  const ball = ballCell === null ? BALL_REST : cellPosition(ballCell)
  const keeper = keeperCell === null ? KEEPER_REST : keeperDive(keeperCell)
  const tilt = keeperCell === null ? 0 : keeperCell % 3 === 0 ? -12 : keeperCell % 3 === 2 ? 12 : 0

  return (
    <>
      <div className={styles.pitch}>
        <div className={styles.frame} aria-hidden="true" />
        <div className={styles.ground} aria-hidden="true" />
        <div
          className={styles.keeper}
          aria-hidden="true"
          style={{ ...place(keeper), '--tilt': `${tilt}deg` } as CSSProperties}
        />
        <div className={styles.ball} aria-hidden="true" style={place(ball)} />

        <div className={styles.grid} role="group" aria-label="Goal — pick a corner to shoot">
          {cells.map((cell) => (
            <button
              key={cell}
              type="button"
              className={styles.cell}
              onClick={() => shoot(cell)}
              disabled={status === 'guessing'}
            >
              <VisuallyHidden>Shoot {cellLabel(cell)}</VisuallyHidden>
            </button>
          ))}
        </div>
      </div>

      <p className={styles.status}>
        {/* The outcome is announced, not just animated. */}
        <span role="status">{MESSAGES[status]}</span>
        <span className={styles.score}>
          Goals {state.goals} · Saves {state.saves}
        </span>
      </p>
    </>
  )
}
