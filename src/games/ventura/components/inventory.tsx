import React from 'react'
import { Gems } from '~/games/ventura/types.ts'
import styles from './styles.module.css'

interface Props {
  gems: Gems
  isLarge?: boolean
}

const Inventory = (props: Props) => {
  const gs: React.JSX.Element[] = []
  const inv = Array(10).fill(null)
  const s = props.gems.flatMap((a, i) => Array.from(Array(a)).map(() => i))
  const q = s.length > 10 ? s.splice(s.length - 10, s.length) : s

  inv.forEach((_n, i) => {
    gs.push(<div key={i} className={styles.grid}>
      <div className={`${styles.gem} ${q[i] === undefined ? '' : styles['gem-' + q[i]]}`}></div>
    </div>)
  })

  return <div className={`${styles.gems} ${props.isLarge ? styles['gems--large'] : ''}`}>{gs}</div>
}

export default Inventory
