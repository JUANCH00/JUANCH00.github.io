import { describe, expect, it } from 'vitest'
import {
  MAX_LOG_ENTRIES,
  createClusterState,
  healthyCount,
  isDegraded,
  isOffline,
  isTotalOutage,
  nodeIds,
  restoreCluster,
  toggleNode,
} from './cluster.machine'

/** Monotonic fake clock: log ids stay unique without depending on wall time. */
const fakeClock = () => {
  let now = 0
  return () => (now += 1)
}

describe('createClusterState', () => {
  it('starts fully healthy and says so in the log', () => {
    const state = createClusterState(3, fakeClock())
    expect(healthyCount(state)).toBe(3)
    expect(isTotalOutage(state)).toBe(false)
    expect(state.log[0]).toMatchObject({ kind: 'cluster-healthy', healthyCount: 3 })
  })

  it.each([0, -1, 2.5])('rejects an invalid size (%p)', (size) => {
    expect(() => createClusterState(size)).toThrow(RangeError)
  })
})

describe('toggleNode', () => {
  it('takes a node offline and brings it back', () => {
    const clock = fakeClock()
    const down = toggleNode(createClusterState(3, clock), 1, clock)
    expect(isOffline(down, 1)).toBe(true)
    expect(healthyCount(down)).toBe(2)
    expect(isDegraded(down)).toBe(true)
    expect(down.log[0]).toMatchObject({ kind: 'node-down', nodeId: 1, healthyCount: 2 })

    const up = toggleNode(down, 1, clock)
    expect(isOffline(up, 1)).toBe(false)
    expect(healthyCount(up)).toBe(3)
    expect(up.log[0]).toMatchObject({ kind: 'node-up', nodeId: 1 })
  })

  it('reports a total outage only when the last replica goes down', () => {
    const clock = fakeClock()
    let state = createClusterState(3, clock)
    for (const id of nodeIds(state)) state = toggleNode(state, id, clock)

    expect(isTotalOutage(state)).toBe(true)
    expect(isDegraded(state)).toBe(false)
    expect(state.log[0]?.kind).toBe('total-outage')
  })

  it('rejects a node that is not in the cluster', () => {
    expect(() => toggleNode(createClusterState(3), 7)).toThrow(RangeError)
  })

  it('never mutates the state it is given', () => {
    const state = createClusterState(3, fakeClock())
    toggleNode(state, 0)
    expect(state.offline).toHaveLength(0)
  })
})

describe('the log', () => {
  it('keeps only the newest entries', () => {
    const clock = fakeClock()
    let state = createClusterState(3, clock)
    for (const id of [0, 1, 2, 0, 1]) state = toggleNode(state, id, clock)

    expect(state.log).toHaveLength(MAX_LOG_ENTRIES)
    expect(new Set(state.log.map((entry) => entry.id)).size).toBe(MAX_LOG_ENTRIES)
  })
})

describe('restoreCluster', () => {
  it('brings every replica back in one step', () => {
    const clock = fakeClock()
    const broken = toggleNode(toggleNode(createClusterState(3, clock), 0, clock), 2, clock)
    const restored = restoreCluster(broken, clock)

    expect(restored.offline).toEqual([])
    expect(healthyCount(restored)).toBe(3)
    expect(restored.log[0]).toMatchObject({ kind: 'cluster-restored' })
  })
})
