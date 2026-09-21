import { describe, expect, it } from 'vitest'
import type { ClusterEvent, ClusterEventKind } from '@domain/lab'
import { clusterEventText } from './clusterMessages'

const event = (
  kind: ClusterEventKind,
  nodeId: number | null,
  healthyCount: number,
): ClusterEvent => ({
  id: `${kind}-test`,
  kind,
  nodeId,
  healthyCount,
  totalCount: 3,
})

describe('clusterEventText', () => {
  it.each([
    [event('cluster-healthy', null, 3), '> cluster healthy: 3/3 replicas'],
    [event('node-down', 1, 2), '> n2 down: balancer rerouted, 2/3 serving'],
    [event('node-up', 1, 3), '> n2 back online: resyncing from the replicaset'],
    [event('total-outage', 2, 0), '> all replicas down: 503 from the balancer'],
    [event('cluster-restored', null, 3), '> cluster restored: 3/3 replicas'],
  ])('describes %o', (input, expected) => {
    expect(clusterEventText(input)).toBe(expected)
  })

  it('numbers nodes from one, the way the diagram labels them', () => {
    expect(clusterEventText(event('node-down', 0, 2))).toMatch(/^> n1 /)
  })
})
