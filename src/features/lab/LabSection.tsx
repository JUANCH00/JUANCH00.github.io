import type { ReactNode } from 'react'
import { useProfile } from '@application/profile'
import { Reveal, Section } from '@ui/primitives'
import { PenaltyLab } from './penalty/PenaltyLab'
import { ClusterLab } from './cluster/ClusterLab'
import styles from './LabSection.module.css'

interface LabCardProps {
  readonly title: string
  readonly badge: string
  readonly blurb: string
  readonly delay: number
  readonly children: ReactNode
}

const LabCard = ({ title, badge, blurb, delay, children }: LabCardProps) => (
  <Reveal as="article" delay={delay} className={styles.card}>
    <div className={styles.head}>
      <h3 className={styles.title}>{title}</h3>
      <span className={styles.badge}>{badge}</span>
    </div>
    <p className={styles.blurb}>{blurb}</p>
    {children}
  </Reveal>
)

/**
 * Two toys, each one a claim from the projects above made checkable by hand.
 * Everything they demonstrate is real: the same accuracy, the same failover.
 */
export const LabSection = () => {
  const { lab } = useProfile()

  return (
    <Section id="lab" title="Lab" description="Two things built from the projects above.">
      <div className={styles.grid}>
        <LabCard
          title="01 / Penalty shootout"
          badge={`Keeper accuracy ${lab.modelAccuracy}%`}
          blurb={`My World Cup model calls matches at ${lab.modelAccuracy}%. The keeper below guesses with the same odds. Pick a corner and try to beat it.`}
          delay={0}
        >
          <PenaltyLab accuracy={lab.modelAccuracy} />
        </LabCard>

        <LabCard
          title="02 / Kill a node"
          badge={`${lab.clusterSize} replicas`}
          blurb="Temuviator keeps serving when a replica dies. Take a node offline and watch the balancer reroute traffic around it."
          delay={80}
        >
          <ClusterLab size={lab.clusterSize} />
        </LabCard>
      </div>
    </Section>
  )
}
