import type { ClusterLayout, NodeCircle } from './clusterLayout'

/** Colours and type for the canvas, resolved from the design tokens. */
export interface ClusterPalette {
  readonly accent: string
  readonly accentLine: string
  readonly accentHalo: string
  readonly text: string
  readonly onAccent: string
  readonly balancerFill: string
  readonly deadFill: string
  readonly deadLine: string
  readonly deadText: string
  readonly caption: string
  readonly fontMono: string
}

const FALLBACK: ClusterPalette = {
  accent: '#ff3d00',
  accentLine: 'rgb(255 61 0 / 42%)',
  accentHalo: 'rgb(255 61 0 / 16%)',
  text: '#f2efe6',
  onAccent: '#0d0c0b',
  balancerFill: '#1a1816',
  deadFill: '#131110',
  deadLine: '#5c564e',
  deadText: '#5c564e',
  caption: '#8f887d',
  fontMono: 'monospace',
}

/**
 * Read the palette from the CSS custom properties in scope for `element`.
 *
 * A canvas cannot use `var()`, so without this the renderer would carry its
 * own copy of every hex value and drift from tokens.css the first time a token
 * changed. Offline nodes use text-faint: the token reserved for disabled.
 */
export const readPalette = (element: Element): ClusterPalette => {
  const style = getComputedStyle(element)
  const token = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback

  return {
    accent: token('--color-accent', FALLBACK.accent),
    accentLine: token('--color-accent-line', FALLBACK.accentLine),
    accentHalo: token('--color-accent-wash', FALLBACK.accentHalo),
    text: token('--color-text', FALLBACK.text),
    onAccent: token('--color-on-accent', FALLBACK.onAccent),
    balancerFill: token('--color-surface-raised', FALLBACK.balancerFill),
    deadFill: token('--color-surface', FALLBACK.deadFill),
    deadLine: token('--color-text-faint', FALLBACK.deadLine),
    deadText: token('--color-text-faint', FALLBACK.deadText),
    caption: token('--color-text-dim', FALLBACK.caption),
    fontMono: token('--font-mono', FALLBACK.fontMono),
  }
}

export interface RenderOptions {
  readonly palette: ClusterPalette
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

const drawLink = (
  ctx: CanvasRenderingContext2D,
  palette: ClusterPalette,
  from: NodeCircle,
  to: NodeCircle,
  dead: boolean,
) => {
  ctx.beginPath()
  ctx.moveTo(from.x + from.radius, from.y)
  ctx.lineTo(to.x - to.radius, to.y)
  ctx.setLineDash(dead ? [3, 5] : [])
  ctx.strokeStyle = dead ? palette.deadLine : palette.accentLine
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
  { palette, layout, offline, time, animated, packets }: RenderOptions,
): void => {
  // Nothing on the canvas is drawn below 12px, same as the rest of the page.
  const labelFont = `500 12px ${palette.fontMono}`
  ctx.clearRect(0, 0, width, height)
  const isDown = (id: number) => offline.includes(id)

  for (const node of layout.nodes) {
    drawLink(ctx, palette, layout.balancer, node, isDown(node.id))
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
    ctx.fillStyle = palette.accent
    ctx.fill()
  }

  drawDisc(ctx, layout.balancer, layout.balancer.radius, palette.balancerFill, palette.text)
  ctx.fillStyle = palette.text
  ctx.font = labelFont
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
      dead ? palette.deadFill : palette.accent,
      dead ? palette.deadLine : palette.accent,
    )
    ctx.fillStyle = dead ? palette.deadText : palette.onAccent
    ctx.font = labelFont
    ctx.fillText(dead ? '×' : `n${node.id + 1}`, node.x, node.y)

    if (!dead) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius + 9, 0, Math.PI * 2)
      ctx.strokeStyle = palette.accentHalo
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }

  const healthy = layout.nodes.length - offline.length
  ctx.textAlign = 'left'
  ctx.fillStyle = palette.caption
  ctx.font = `400 12px ${palette.fontMono}`
  ctx.fillText(
    healthy ? `serving ${healthy}/${layout.nodes.length}` : 'TOTAL OUTAGE',
    14,
    height - 14,
  )
}
