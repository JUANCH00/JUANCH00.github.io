export interface Point {
  readonly x: number
  readonly y: number
}

export interface NodeCircle extends Point {
  readonly id: number
  readonly radius: number
}

export interface ClusterLayout {
  readonly balancer: NodeCircle
  readonly nodes: readonly NodeCircle[]
}

const BALANCER_RADIUS = 26
const NODE_RADIUS = 22
/** Extra slack around a node so a click near the edge still counts. */
const HIT_PADDING = 6

/**
 * Place the balancer on the left and spread the replicas evenly down the right.
 *
 * Pure geometry: it takes a box and a node count and returns coordinates, which
 * keeps it testable and lets the canvas be resized by simply calling it again.
 */
export const layoutCluster = (width: number, height: number, size: number): ClusterLayout => ({
  balancer: { id: -1, x: width * 0.18, y: height / 2, radius: BALANCER_RADIUS },
  nodes: Array.from({ length: size }, (_, index) => ({
    id: index,
    x: width * 0.72,
    y: (height * (index + 1)) / (size + 1),
    radius: NODE_RADIUS,
  })),
})

/** Which node, if any, sits under a point. Returns `null` for empty canvas. */
export const nodeAt = (layout: ClusterLayout, point: Point): number | null => {
  const hit = layout.nodes.find(
    (node) => Math.hypot(point.x - node.x, point.y - node.y) <= node.radius + HIT_PADDING,
  )
  return hit ? hit.id : null
}
