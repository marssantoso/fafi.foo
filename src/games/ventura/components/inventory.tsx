import React from 'react'
import styles from './styles.module.css'
import { Gems } from '../types.ts'
import {gemsToPieces} from "../utils.ts";

interface Props {
  gems: Gems
  isLarge?: boolean
}

const Inventory = (props: Props) => {
  const grid: React.JSX.Element[] = []
  const inv = Array(10).fill(null)
  const pieces = gemsToPieces(props.gems)

  inv.forEach((_n, i) => {
    grid.push(<div key={i} className={styles.grid}>
      <div className={`${styles.gem} ${pieces[i] === undefined ? '' : styles['gem-' + pieces[i]]}`}></div>
    </div>)
  })

  return <div className={`${styles.gems} ${props.isLarge ? styles['gems--large'] : ''}`}>{grid}</div>
}

export default Inventory
