import type { CSSProperties } from 'react'
import { GOAL_CELL_COUNT, type GoalCell } from '@domain/lab'
import { usePenaltyGame, type PenaltyStatus } from '@application/lab'
import { VisuallyHidden } from '@ui/primitives'
import {
  BALL_REST,
  KEEPER_REST,
  PITCH,
  cellLabel,
  cellPosition,
  keeperDive,
  type CellPosition,
} from './goalGeometry'
import styles from './PenaltyLab.module.css'

const MESSAGES: Record<PenaltyStatus, string> = {
  ready: 'pick a corner',
  guessing: 'the model is guessing…',
  saved: 'saved — the model called it',
  scored: 'goal — outside the model',
}

/**
 * Positions travel as custom properties into a `translate()` on a pitch-sized
 * layer, so moving the ball or the keeper is a compositor-only transform, not a
 * change to `left`/`bottom` that would re-run layout on every frame.
 */
const place = ({ leftPct, bottomPct }: CellPosition): CSSProperties =>
  ({ '--left': `${leftPct}%`, '--bottom': `${bottomPct}%` }) as CSSProperties

/** The frame and ground are drawn from the same numbers the geometry uses. */
const pitchInsets = {
  '--inset-top': `${PITCH.topInsetPct}%`,
  '--inset-side': `${PITCH.sideInsetPct}%`,
  '--ground': `${PITCH.groundPct}%`,
} as CSSProperties

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
      <div className={styles.pitch} style={pitchInsets}>
        <div className={styles.frame} aria-hidden="true" />
        <div className={styles.ground} aria-hidden="true" />
        <div
          className={`${styles.layer} ${styles.keeperLayer}`}
          style={place(keeper)}
          aria-hidden="true"
        >
          <div className={styles.keeper} style={{ '--tilt': `${tilt}deg` } as CSSProperties} />
        </div>
        <div
          className={`${styles.layer} ${styles.ballLayer}`}
          style={place(ball)}
          aria-hidden="true"
        >
          <div className={styles.ball} />
        </div>

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
