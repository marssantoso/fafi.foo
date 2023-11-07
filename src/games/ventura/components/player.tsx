import { Gems } from '../types'
import Inventory from "./inventory.tsx"
import styles from './styles.module.css'

interface Props {
  gems: Gems
  name?: string
  isActive?: boolean
}

const Player = (props: Props) => {
  return <div className={styles.player}>
    <p className={`${styles.playerName} ${props.isActive ? styles['playerName--active'] : ''}`}>
      <span>{props.name}</span>
      {props.isActive ? ' *' : ''}
    </p>
    <Inventory gems={props.gems} />
  </div>
}

export default Player
