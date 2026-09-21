import type { ClusterEvent } from '@domain/lab'

/**
 * Turn a domain event into the line shown in the log.
 *
 * Wording lives in the UI layer: the domain says *what happened*, this decides
 * *how to say it*. Translating the site later means editing this file only.
 */
export const clusterEventText = (event: ClusterEvent): string => {
  const node = event.nodeId === null ? '' : `n${event.nodeId + 1}`

  switch (event.kind) {
    case 'cluster-healthy':
      return `> cluster healthy: ${event.healthyCount}/${event.totalCount} replicas`
    case 'node-up':
      return `> ${node} back online: resyncing from the replicaset`
    case 'node-down':
      return `> ${node} down: balancer rerouted, ${event.healthyCount}/${event.totalCount} serving`
    case 'total-outage':
      return '> all replicas down: 503 from the balancer'
    case 'cluster-restored':
      return `> cluster restored: ${event.healthyCount}/${event.totalCount} replicas`
  }
}
