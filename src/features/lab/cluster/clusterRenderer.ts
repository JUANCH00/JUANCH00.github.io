import type { ClusterLayout, NodeCircle } from './clusterLayout'

export interface RenderOptions {
  readonly layout: ClusterLayout
  readonly offline: readonly number[]
  /** Milliseconds since start, used for the idle pulse. Frozen when animation is off. */
  readonly time: number
  readonly animated: boolean
  readonly packets: readonly Packet[]
}

export interface Packet {
  readonly targetId: number
  /** Progress along the balancer → node line, 0..1. */
  readonly progress: number
}

const COLORS = {
  accent: '#ff3d00',
  accentLine: 'rgba(255,61,0,.42)',
  accentHalo: 'rgba(255,61,0,.2)',
  text: '#f2efe6',
  bg: '#0d0c0b',
  deadFill: '#141210',
  deadLine: '#3a352f',
  deadText: '#5c564e',
  balancerFill: '#1c1917',
  caption: '#5c564e',
} as const

const LABEL_FONT = '500 10px "IBM Plex Mono", monospace'

const drawLink = (
  ctx: CanvasRenderingContext2D,
  from: NodeCircle,
  to: NodeCircle,
  dead: boolean,
) => {
  ctx.beginPath()
  ctx.moveTo(from.x + from.radius, from.y)
  ctx.lineTo(to.x - to.radius, to.y)
  ctx.setLineDash(dead ? [3, 5] : [])
  ctx.strokeStyle = dead ? COLORS.deadLine : COLORS.accentLine
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.setLineDash([])
}

const drawDisc = (
  ctx: CanvasRenderingContext2D,
  circle: NodeCircle,
  radius: number,
  fill: string,
  stroke: string,
) => {
  ctx.beginPath()
  ctx.arc(circle.x, circle.y, radius, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.5
  ctx.stroke()
}

/**
 * Draw one frame of the cluster.
 *
 * The renderer is a pure function of `(context, options)` — it holds no state of
 * its own, so what appears on screen is always exactly the cluster state from
 * the domain. Animation state (time, packets) is passed in by the caller.
 */
export const renderCluster = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  { layout, offline, time, animated, packets }: RenderOptions,
): void => {
  ctx.clearRect(0, 0, width, height)
  const isDown = (id: number) => offline.includes(id)

  for (const node of layout.nodes) {
    drawLink(ctx, layout.balancer, node, isDown(node.id))
  }

  for (const packet of packets) {
    const target = layout.nodes.find((node) => node.id === packet.targetId)
    if (!target || isDown(packet.targetId)) continue
    ctx.beginPath()
    ctx.arc(
      layout.balancer.x + (target.x - layout.balancer.x) * packet.progress,
      layout.balancer.y + (target.y - layout.balancer.y) * packet.progress,
      3,
      0,
      Math.PI * 2,
    )
    ctx.fillStyle = COLORS.accent
    ctx.fill()
  }

  drawDisc(ctx, layout.balancer, layout.balancer.radius, COLORS.balancerFill, COLORS.text)
  ctx.fillStyle = COLORS.text
  ctx.font = LABEL_FONT
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('LB', layout.balancer.x, layout.balancer.y)

  for (const node of layout.nodes) {
    const dead = isDown(node.id)
    const pulse = dead || !animated ? 1 : 1 + Math.sin(time / 420 + node.id) * 0.06
    drawDisc(
      ctx,
      node,
      node.radius * pulse,
      dead ? COLORS.deadFill : COLORS.accent,
      dead ? COLORS.deadLine : COLORS.accent,
    )
    ctx.fillStyle = dead ? COLORS.deadText : COLORS.bg
    ctx.font = LABEL_FONT
    ctx.fillText(dead ? '×' : `n${node.id + 1}`, node.x, node.y)

    if (!dead) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius + 9, 0, Math.PI * 2)
      ctx.strokeStyle = COLORS.accentHalo
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }

  const healthy = layout.nodes.length - offline.length
  ctx.textAlign = 'left'
  ctx.fillStyle = COLORS.caption
  ctx.font = '400 10px "IBM Plex Mono", monospace'
  ctx.fillText(
    healthy ? `serving ${healthy}/${layout.nodes.length}` : 'TOTAL OUTAGE',
    14,
    height - 14,
  )
}
