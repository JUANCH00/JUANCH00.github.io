import { useCallback, useMemo, useState } from 'react'
import {
  createClusterState,
  healthyCount,
  isOffline,
  isTotalOutage,
  nodeIds,
  restoreCluster,
  toggleNode,
  type ClusterState,
  type NodeId,
} from '@domain/lab'

export interface ClusterSimulation {
  readonly state: ClusterState
  readonly nodes: readonly NodeId[]
  readonly healthy: number
  readonly total: number
  readonly outage: boolean
  readonly isDown: (id: NodeId) => boolean
  readonly toggle: (id: NodeId) => void
  readonly restore: () => void
}

/** React binding for the cluster rules in `@domain/lab`. All logic is delegated. */
export const useClusterSimulation = (size: number): ClusterSimulation => {
  const [state, setState] = useState<ClusterState>(() => createClusterState(size))

  const toggle = useCallback((id: NodeId) => setState((s) => toggleNode(s, id)), [])
  const restore = useCallback(() => setState(restoreCluster), [])
  const isDown = useCallback((id: NodeId) => isOffline(state, id), [state])
  const nodes = useMemo(() => nodeIds(state), [state])

  return {
    state,
    nodes,
    healthy: healthyCount(state),
    total: state.size,
    outage: isTotalOutage(state),
    isDown,
    toggle,
    restore,
  }
}
