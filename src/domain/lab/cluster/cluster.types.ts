export type NodeId = number

/**
 * What happened to the cluster, described semantically. The domain never emits
 * user-facing strings: the UI owns wording (and, if the site is ever translated,
 * translation) by mapping these events to text.
 */
export type ClusterEventKind =
  'cluster-healthy' | 'node-down' | 'node-up' | 'total-outage' | 'cluster-restored'

export interface ClusterEvent {
  readonly id: string
  readonly kind: ClusterEventKind
  readonly nodeId: NodeId | null
  readonly healthyCount: number
  readonly totalCount: number
}

export interface ClusterState {
  readonly size: number
  readonly offline: readonly NodeId[]
  readonly log: readonly ClusterEvent[]
}

/** Injected clock, so log ids are deterministic under test. */
export type Clock = () => number
