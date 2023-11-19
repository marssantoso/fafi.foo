import type { Gems } from '../types'
import { gemsToPieces } from '../utils.ts'
import styles from './styles.module.css'

interface Props {
  price: Gems
  isSmall?: boolean
}

// TODO: rename to Pieces
const Price = (props: Props) => {
  const pieces = gemsToPieces(props.price)

  return (
    <div className={`${styles.price}`}>
      {pieces.map((i, j) => (
        <div key={j} className={`${styles.gem} ${styles['gem-' + i]} ${props.isSmall ? styles['gem--small'] : ''}`}></div>
      ))}
    </div>
  )
}

export default Price
