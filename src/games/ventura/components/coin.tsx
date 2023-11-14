import styles from './styles.module.css'

interface Props {
  type?: 'gold' | 'silver'
  children: number
}

const Coin = ({ children, type }: Props) => {
  if (!children || children < 1) return <></>

  const MAX_SHOWN = 6
  const amount = children > MAX_SHOWN ? MAX_SHOWN : children
  const remainder = children > MAX_SHOWN ? children - MAX_SHOWN : 0
  return (
    <div className={`${styles.coins} ${type ? styles['coins--' + type] : ''}`}>
      {Array.from(Array(amount)).map((_, i) => (
        <div key={i} className={styles.coin}></div>
      ))}
      {remainder ? <span className={styles.coinRemainder}>+{remainder}</span> : <></>}
    </div>
  )
}

export default Coin
