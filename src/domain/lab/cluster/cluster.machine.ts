import type { Clock, ClusterEvent, ClusterEventKind, ClusterState, NodeId } from './cluster.types'

export const DEFAULT_CLUSTER_SIZE = 3
/** The event log is a ticker, not a history: only the newest lines are kept. */
export const MAX_LOG_ENTRIES = 3

const event = (
  kind: ClusterEventKind,
  nodeId: NodeId | null,
  healthyCount: number,
  totalCount: number,
  clock: Clock,
): ClusterEvent => ({
  id: `${kind}-${nodeId ?? 'all'}-${clock()}`,
  kind,
  nodeId,
  healthyCount,
  totalCount,
})

const withEvent = (state: ClusterState, next: ClusterEvent): readonly ClusterEvent[] =>
  [next, ...state.log].slice(0, MAX_LOG_ENTRIES)

export const createClusterState = (
  size: number = DEFAULT_CLUSTER_SIZE,
  clock: Clock = Date.now,
): ClusterState => {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError(`Cluster size must be a positive integer, received ${size}`)
  }
  const base: ClusterState = { size, offline: [], log: [] }
  return { ...base, log: [event('cluster-healthy', null, size, size, clock)] }
}

export const nodeIds = (state: ClusterState): readonly NodeId[] =>
  Array.from({ length: state.size }, (_, index) => index)

export const isOffline = (state: ClusterState, nodeId: NodeId): boolean =>
  state.offline.includes(nodeId)

export const healthyCount = (state: ClusterState): number => state.size - state.offline.length

export const isTotalOutage = (state: ClusterState): boolean => healthyCount(state) === 0

export const isDegraded = (state: ClusterState): boolean =>
  state.offline.length > 0 && !isTotalOutage(state)

/**
 * Take a node offline, or bring it back. The load balancer reroutes implicitly:
 * traffic is only ever sent to nodes absent from `offline`, so there is no
 * separate routing state that could drift out of sync with node health.
 */
export const toggleNode = (
  state: ClusterState,
  nodeId: NodeId,
  clock: Clock = Date.now,
): ClusterState => {
  if (!nodeIds(state).includes(nodeId)) {
    throw new RangeError(`Node ${nodeId} is not part of a ${state.size}-node cluster`)
  }

  const wasOffline = isOffline(state, nodeId)
  const offline = wasOffline
    ? state.offline.filter((id) => id !== nodeId)
    : [...state.offline, nodeId]

  const next: ClusterState = { ...state, offline }
  const healthy = healthyCount(next)
  const kind: ClusterEventKind = wasOffline
    ? 'node-up'
    : healthy === 0
      ? 'total-outage'
      : 'node-down'

  return { ...next, log: withEvent(state, event(kind, nodeId, healthy, state.size, clock)) }
}

export const restoreCluster = (state: ClusterState, clock: Clock = Date.now): ClusterState => ({
  ...state,
  offline: [],
  log: withEvent(state, event('cluster-restored', null, state.size, state.size, clock)),
})
