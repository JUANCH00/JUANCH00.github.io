import { describe, expect, it } from 'vitest'
import { layoutCluster, nodeAt } from './clusterLayout'

const layout = layoutCluster(400, 300, 3)

describe('layoutCluster', () => {
  it('puts the balancer left of every replica', () => {
    for (const node of layout.nodes) {
      expect(layout.balancer.x).toBeLessThan(node.x)
    }
  })

  it('spreads replicas evenly and inside the canvas', () => {
    const ys = layout.nodes.map((node) => node.y)
    expect(ys).toEqual([75, 150, 225])
    for (const node of layout.nodes) {
      expect(node.y - node.radius).toBeGreaterThan(0)
      expect(node.y + node.radius).toBeLessThan(300)
    }
  })

  it('scales with the canvas', () => {
    const wide = layoutCluster(800, 300, 3)
    expect(wide.balancer.x).toBeCloseTo(layout.balancer.x * 2, 5)
  })

  it('supports cluster sizes other than three', () => {
    expect(layoutCluster(400, 300, 5).nodes).toHaveLength(5)
  })
})

describe('nodeAt', () => {
  it('finds the node under a click', () => {
    const target = layout.nodes[1]!
    expect(nodeAt(layout, { x: target.x, y: target.y })).toBe(1)
    expect(nodeAt(layout, { x: target.x + target.radius, y: target.y })).toBe(1)
  })

  it('returns null for empty canvas and for the balancer', () => {
    expect(nodeAt(layout, { x: 5, y: 5 })).toBeNull()
    expect(nodeAt(layout, { x: layout.balancer.x, y: layout.balancer.y })).toBeNull()
  })
})
