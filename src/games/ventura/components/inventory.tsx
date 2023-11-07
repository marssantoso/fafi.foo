import styles from './styles.module.css'
import { Gems } from '../types.ts'
import { gemsToPieces } from '../utils.ts'

interface Props {
  gems: Gems
  isLarge?: boolean
  isSelectable?: boolean
  selected?: number[]
  onSelect?: (id: number) => void
}

const Inventory = ({ gems, isLarge, isSelectable, onSelect, selected }: Props) => {
  const inv = Array(10).fill(null)
  const pieces = gemsToPieces(gems)
  const className = `${styles.gems} ${isLarge ? styles['gems--large'] : ''} ${isSelectable ? styles['gems--selectable'] : ''}`

  return (
    <div className={className}>
      {inv.map((_n, i) => <div key={i} className={`${styles.grid} ${isSelectable && selected?.includes(i) ? styles['grid--selected'] : ''}`}>
        {pieces[i] === undefined ? (
          <div className={`${styles.gem} ${styles['gem--empty']}`} />
        ) : (
          <div className={`${styles.gem} ${styles['gem-' + pieces[i]]}`} onClick={() => onSelect && onSelect(i)} />
        )}
      </div>)}
    </div>
  )
}

export default Inventory
