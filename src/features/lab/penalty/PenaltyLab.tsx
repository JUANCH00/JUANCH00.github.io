import type { CSSProperties } from 'react'
import { GOAL_CELL_COUNT, type GoalCell } from '@domain/lab'
import { usePenaltyGame } from '@application/lab'
import { VisuallyHidden } from '@ui/primitives'
import {
  BALL_REST,
  KEEPER_REST,
  PITCH,
  SIZES_REM,
  cellLabel,
  cellPosition,
  keeperDive,
  keeperTilt,
  type CellPosition,
} from './goalGeometry'
import { penaltyStatusText, scoreText } from './penaltyMessages'
import styles from './PenaltyLab.module.css'

/**
 * Positions travel as custom properties into a `translate()` on a pitch-sized
 * layer, so moving the ball or the keeper is a compositor-only transform, not a
 * change to `left`/`bottom` that would re-run layout on every frame.
 */
const place = ({ leftPct, bottomPct }: CellPosition): CSSProperties =>
  ({ '--left': `${leftPct}%`, '--bottom': `${bottomPct}%` }) as CSSProperties

/** The pitch is drawn from the same numbers the geometry and its tests use. */
const pitchVars = {
  '--inset-top': `${PITCH.topInsetPct}%`,
  '--inset-side': `${PITCH.sideInsetPct}%`,
  '--ground': `${PITCH.groundPct}%`,
  '--pitch-height': `${SIZES_REM.pitchHeight}rem`,
  '--keeper-width': `${SIZES_REM.keeperWidth}rem`,
  '--keeper-height': `${SIZES_REM.keeperHeight}rem`,
  '--ball-size': `${SIZES_REM.ball}rem`,
} as CSSProperties

const cells: readonly GoalCell[] = Array.from({ length: GOAL_CELL_COUNT }, (_, index) => index)

/**
 * The keeper saves at exactly the validation accuracy of the GoalPredict model,
 * so playing this is the same as reading the number — only harder to forget.
 */
export const PenaltyLab = ({ accuracy }: { readonly accuracy: number }) => {
  const { state, status, canShoot, keeperCell, ballCell, shoot } = usePenaltyGame({ accuracy })

  // Ball, keeper and scoreboard all derive from the one shot in `state`.
  const ball = ballCell === null ? BALL_REST : cellPosition(ballCell)
  const keeper = keeperCell === null ? KEEPER_REST : keeperDive(keeperCell)
  const tilt = keeperCell === null ? 0 : keeperTilt(keeperCell)

  return (
    <>
      <div className={styles.pitch} style={pitchVars}>
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

        <div className={styles.grid} role="group" aria-label="Goal: pick a corner to shoot">
          {cells.map((cell) => (
            <button
              key={cell}
              type="button"
              className={styles.cell}
              onClick={() => shoot(cell)}
              disabled={!canShoot}
            >
              <VisuallyHidden>Shoot {cellLabel(cell)}</VisuallyHidden>
            </button>
          ))}
        </div>
      </div>

      <p className={styles.status}>
        {/* The outcome is announced, not just animated. */}
        <span role="status">{penaltyStatusText(status)}</span>
        <span className={styles.score}>{scoreText(state)}</span>
      </p>
    </>
  )
}
