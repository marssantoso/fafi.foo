import Card from './card'
import Price from './price'
import type { ActionCard } from '../types'
import styles from './styles.module.css'

const ActionCardComponent = (props: ActionCard) => {
  if (props.gain) {
    return (
      <Card>
        <Price price={props.gain} />
        <span className={styles.sign}>＋</span>
      </Card>
    )
  }

  if (props.exchange) {
    return (
      <Card>
        <Price price={props.exchange[1]} />
        <span className={styles.sign}>⇧</span>
        <Price price={props.exchange[0]} />
      </Card>
    )
  }

  if (props.upgrade) {
    const pieces = Array(props.upgrade).fill(null)
    return (
      <Card>
        <Price price={[0, 0, 0, 0]}/>
        <span className={styles.sign}>⇧⇧</span>
        <div className={styles.price}>
          {pieces.map((_i, j) => (
            <div key={j} className={`${styles.gem} ${styles['gem--uncolored']}`} />
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
