import { useEffect, useRef } from 'react'
import { useClusterSimulation } from '@application/lab'
import { usePrefersReducedMotion } from '@ui/hooks/useMediaQuery'
import { layoutCluster, nodeAt, type ClusterLayout } from './clusterLayout'
import { renderCluster, type Packet } from './clusterRenderer'
import { clusterEventText } from './clusterMessages'
import styles from './ClusterLab.module.css'

/** How often the balancer emits a request, in milliseconds. */
const PACKET_INTERVAL_MS = 480
const PACKET_SPEED = 0.016

/**
 * Temuviator, in miniature: take a replica offline and watch the balancer keep
 * serving from the rest.
 *
 * The canvas is a *view*. Cluster state lives in `@domain/lab` and reaches this
 * component through `useClusterSimulation`; the animation loop below only draws
 * and moves packets. Because of that split, the node buttons and the canvas are
 * two front-ends onto the same state and can never disagree.
 */
export const ClusterLab = ({ size }: { readonly size: number }) => {
  const cluster = useClusterSimulation(size)
  const reducedMotion = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // The draw loop reads state through a ref so it never has to be torn down and
  // rebuilt on every click — restarting requestAnimationFrame mid-interaction
  // is what makes canvas UIs stutter.
  const stateRef = useRef(cluster)
  useEffect(() => {
    stateRef.current = cluster
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let layout: ClusterLayout = layoutCluster(0, 0, size)
    let width = 0
    let height = 0
    let packets: Packet[] = []
    let lastSpawn = 0
    let frame = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      layout = layoutCluster(width, height, size)
    }

    const draw = (time: number) => {
      const { state, nodes } = stateRef.current

      if (!reducedMotion) {
        const live = nodes.filter((id) => !state.offline.includes(id))
        if (time - lastSpawn > PACKET_INTERVAL_MS && live.length > 0) {
          lastSpawn = time
          const target = live[Math.floor(Math.random() * live.length)]
          if (target !== undefined) packets.push({ targetId: target, progress: 0 })
        }
        packets = packets
          .map((packet) => ({ ...packet, progress: packet.progress + PACKET_SPEED }))
          .filter((packet) => packet.progress <= 1)
      } else {
        packets = []
      }

      renderCluster(ctx, width, height, {
        layout,
        offline: state.offline,
        time,
        animated: !reducedMotion,
        packets,
      })
      frame = requestAnimationFrame(draw)
    }

    const click = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const id = nodeAt(layout, { x: event.clientX - rect.left, y: event.clientY - rect.top })
      if (id !== null) stateRef.current.toggle(id)
    }

    resize()
    frame = requestAnimationFrame(draw)
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    canvas.addEventListener('click', click)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('click', click)
    }
  }, [size, reducedMotion])

  return (
    <>
      <div className={styles.stage}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          role="img"
          aria-label={`Cluster diagram: ${cluster.healthy} of ${cluster.total} replicas serving traffic.`}
        />
      </div>

      <div className={styles.controls}>
        {/* Keyboard and screen-reader path to the same actions as the canvas. */}
        <div className={styles.nodes}>
          {cluster.nodes.map((id) => (
            <button
              key={id}
              type="button"
              className={styles.node}
              aria-pressed={cluster.isDown(id)}
              onClick={() => cluster.toggle(id)}
            >
              n{id + 1}
            </button>
          ))}
        </div>
        <button type="button" className={styles.restore} onClick={cluster.restore}>
          Restore all
        </button>
      </div>

      <p className={styles.log} role="status">
        {cluster.state.log.map((event) => (
          <span key={event.id}>{clusterEventText(event)}</span>
        ))}
      </p>
    </>
  )
}
