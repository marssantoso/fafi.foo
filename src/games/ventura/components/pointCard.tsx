import type { PointCard, OnClickCard } from '../types'
import styles from './styles.module.css'
import Card from './card.tsx'
import Price from './price.tsx'

interface Props extends PointCard {
  onClick?: OnClickCard<PointCard>
  isSmall?: boolean
}

const PointCardComponent = (props: Props) => {
  return (
    <Card onClick={props.onClick} isSmall={props.isSmall}>
      <div className={styles.pointCard}>
        <div className={styles.pointCard__section}>
          <span className={styles.pointCard__point}>{props.point}</span>
        </div>
        <div className={styles.pointCard__section}>
          <Price price={props.price} isSmall={props.isSmall} />
        </div>
      </div>
    </Card>
  )
}

export default PointCardComponent
