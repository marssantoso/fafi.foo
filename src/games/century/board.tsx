import styles from './styles.module.css'
import {ActionCard, Card, Gems} from '~/games/century/types.ts'

export const CenturyBoard = () => {
  const players = [{ id: '0', name: 'foo', gems: [0, 0, 0, 0] }]
  const pointCards: Card[] = [
    {point: 6, price: [0, 2, 0, 0]},
    {point: 14, price: [0, 0, 1, 2]},
    {point: 9, price: [0, 3, 0, 0]},
    {point: 7, price: [2, 1, 0, 0]},
    {point: 18, price: [0, 1, 0, 3]},
  ]
  const actionCards: ActionCard[] = [
    {upgrade: 3},
    {exchange: [[0, 2, 0, 0], [0, 0, 3, 0]]},
    {exchange: [[1, 1, 0, 0], [0, 2, 1, 0]]},
    {gain: [1, 1, 0, 0]},
    {exchange: [[1, 1, 1, 0], [0, 0, 0, 1]]},
    {gain: [0, 0, 1, 0]},
  ]
  const inventory: Gems = [3, 0, 0, 0]
  return (
    <div>
      <h1>Century</h1>
      <div className={styles.wrapper}>
        <div className={styles.players}>
          {players.map(({ name, gems }, i) => (
            <div key={i} className={styles.playerCard}>
              <p>{name}</p>
              <span>{gems.join(' - ')}</span>
            </div>
          ))}
        </div>
        <div className={styles.board}>
          <div className="table">
            <div className="gems"></div>
            <div className={styles.cards}>
              {pointCards.map(({ point, price }, i) => (
                <div key={i} className={`${styles.card} ${styles['pointCard--open']}`}>
                  <p>{point}</p>
                  <span>{price.join(' - ')}</span>
                </div>
              ))}
              <div className={`${styles.card} ${styles['pointCard--closed']}`}></div>
            </div>
            <div className={styles.cards}>
              {actionCards.map((c, i) => (
                <div key={i} className={`${styles.card} ${styles['actionCard--open']}`}>
                  {c.gain ? 'gain' : c.upgrade ? 'upgrade' : 'exchange'}
                </div>
              ))}
              <div className={`${styles.card} ${styles['actionCard--closed']}`}></div>
            </div>
          </div>
          <div className={styles.hand}>
            <div className={styles.inventory}>
              <span>{inventory.join(' - ')}</span>
            </div>
            <div className={styles.cards}>
              <div className={`${styles.card} ${styles['pointCard--closed']}`}></div>
            </div>
            <div className={styles.cards}>
              <div className={`${styles.card} ${styles['actionCard--closed']}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
