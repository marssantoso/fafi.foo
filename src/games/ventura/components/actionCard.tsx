import Card from './card'
import Price from './price'
import type { ActionCard, OnClickCard } from '../types'
import styles from './styles.module.css'
import ActionIcon from './actionIcon.tsx'

interface Props extends ActionCard {
  onClick?: OnClickCard<ActionCard>
  isSmall?: boolean
}

const ActionCardComponent = (props: Props) => {
  if (props.gain) {
    return (
      <div className={styles.actionCard}>
        <Card isSmall={props.isSmall} onClick={props.onClick}>
          <div className={styles.actionCard__section}>
            <Price price={props.gain} isSmall={props.isSmall} />
          </div>
          <div className={styles.actionCard__section}>
            <ActionIcon type="gain" isSmall={props.isSmall} />
          </div>
          <div className={styles.actionCard__section}></div>
          <div className={styles.actionCard__section}>
            <span className={styles.actionCard__name}>GAIN</span>
          </div>
        </Card>
      </div>
    )
  }

  if (props.exchange) {
    return (
      <div className={styles.actionCard}>
        <Card isSmall={props.isSmall} onClick={props.onClick}>
          <div className={styles.actionCard__section}>
            <Price price={props.exchange[1]} isSmall={props.isSmall} />
          </div>
          <div className={styles.actionCard__section}>
            <ActionIcon type="exchange" isSmall={props.isSmall} />
          </div>
          <div className={styles.actionCard__section}>
            <Price price={props.exchange[0]} isSmall={props.isSmall} />
          </div>
          <div className={styles.actionCard__section}>
            <span className={styles.actionCard__name}>EXCHANGE</span>
          </div>
        </Card>
      </div>
    )
  }

  if (props.upgrade) {
    const pieces = Array(props.upgrade).fill(null)
    return (
      <div className={styles.actionCard}>
        <Card isSmall={props.isSmall} onClick={props.onClick}>
          <div className={styles.actionCard__section}></div>
          <div className={styles.actionCard__section}>
            <ActionIcon type="upgrade" isSmall={props.isSmall} />
          </div>
          <div className={styles.actionCard__section}>
            <div className={`${styles.price}`}>
              {pieces.map((_i, j) => (
                <div
                  key={j}
                  className={`${styles.gem} ${styles['gem--wild']} ${props.isSmall ? styles['gem--small'] : ''}`}
                />
              ))}
            </div>
          </div>
          <div className={styles.actionCard__section}>
            <span className={styles.actionCard__name}>UPGRADE</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <span>{Object.keys(props)[0]}</span>
    </Card>
  )
}

export default ActionCardComponent
