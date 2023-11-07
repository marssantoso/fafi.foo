import type { PointCard } from '../types'
import styles from './styles.module.css'
import Card from './card.tsx'
import Price from './price.tsx'

const PointCardComponent = (props: PointCard) => {
  return (
    <Card>
      <div className={styles.pointCard}>
        <div className={styles['pointCard__point']}>
          <span className={styles.point}>{props.point}</span>
        </div>
        <Price price={props.price} />
      </div>
    </Card>
  )
}

export default PointCardComponent
