import type { PointCard, OnClickCard } from '../types'
import styles from './styles.module.css'
import Card from './card.tsx'
import Price from './price.tsx'

interface Props extends PointCard {
  onClick?: OnClickCard<PointCard>
}

const PointCardComponent = (props: Props) => {
  return (
    <Card onClick={props.onClick}>
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
