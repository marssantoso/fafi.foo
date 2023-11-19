import Card from './card'
import Price from './price'
import type { ActionCard, OnClickCard } from '../types'
import styles from './styles.module.css'

interface Props extends ActionCard {
  onClick?: OnClickCard<ActionCard>
  isSmall?: boolean
}

const ActionCardComponent = (props: Props) => {
  if (props.gain) {
    return (
      <Card isSmall={props.isSmall} onClick={props.onClick}>
        <Price price={props.gain} isSmall={props.isSmall} />
        <span className={styles.sign}>＋</span>
      </Card>
    )
  }

  if (props.exchange) {
    return (
      <Card isSmall={props.isSmall} onClick={props.onClick}>
        <Price price={props.exchange[1]} isSmall={props.isSmall} />
        <span className={styles.sign}>⇧</span>
        <Price price={props.exchange[0]} isSmall={props.isSmall} />
      </Card>
    )
  }

  if (props.upgrade) {
    const pieces = Array(props.upgrade).fill(null)
    return (
      <Card isSmall={props.isSmall} onClick={props.onClick}>
        <Price price={[0, 0, 0, 0]} />
        <span className={styles.sign}>⇧⇧</span>
        <div className={`${styles.price}`}>
          {pieces.map((_i, j) => (
            <div
              key={j}
              className={`${styles.gem} ${styles['gem--uncolored']} ${props.isSmall ? styles['gem--small'] : ''}`}
            />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <span>{Object.keys(props)[0]}</span>
    </Card>
  )
}

export default ActionCardComponent
