import { useState } from 'react'
import { PlayerState } from '../types'
import { sumPoint } from '../utils'
import styles from './styles.module.css'

// components
import Inventory from './inventory.tsx'
import PointCardComponent from './pointCard.tsx'
import ActionCardComponent from './actionCard.tsx'
import ClosedCard from './closedCard.tsx'
import Coin from './coin.tsx'

interface Props extends PlayerState {
  isFull?: boolean
  isRevealed?: boolean
}

const Player = (props: Props) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={styles.playerOverview}
      onMouseEnter={() => !props.isFull && setIsHovered(true)}
      onMouseLeave={() => !props.isFull && setIsHovered(false)}
    >
      <div className={styles.player}>
        <p className={`${styles['player__name']} ${props.isActive ? styles['player__name--active'] : ''}`}>
          <span>
            {props.name}
            {props.isActive ? ' *' : ''}
          </span>
        </p>
        <Inventory gems={props.gems} />
      </div>
      {props.isRevealed ? (
        <>
          <div className={styles.playerOverview__separator}>
            <span className={styles.playerOverview__separatorText}>points</span>
          </div>
          <div className={styles.playerOverview__point}>
            <span>{sumPoint(props)}</span>
          </div>
        </>
      ) : (
        ''
      )}
      {isHovered || props.isFull ? (
        <div className={`${styles['player--hovered']} ${props.isFull ? styles['player--full'] : ''}`}>
          {props.actionCards.length ? (
            <>
              <div className={styles.playerOverview__separator}>
                <span className={styles.playerOverview__separatorText}>hands</span>
              </div>
              <div className={styles.playerOverview__cards}>
                {props.actionCards.map((card, i) => (
                  <ActionCardComponent key={`action-${i}`} {...card} isSmall />
                ))}
              </div>
            </>
          ) : (
            ''
          )}
          {props.used.length ? (
            <div className={styles.playerOverview__separator}>
              <span className={styles.playerOverview__separatorText}>used</span>
            </div>
          ) : (
            ''
          )}
          <div className={styles.playerOverview__cards}>
            {props.used.map((card, i) => (
              <ActionCardComponent key={`used-${i}`} {...card} isSmall />
            ))}
          </div>
          {props.pointCards.length ? (
            <>
              <div className={styles.playerOverview__separator}>
                <span className={styles.playerOverview__separatorText}>bought</span>
              </div>
              <div className={styles.playerOverview__cards}>
                {props.isRevealed ? (
                  props.pointCards.map((card) => <PointCardComponent {...card} isSmall />)
                ) : (
                  <ClosedCard type="point" isSmall>
                    <span>Point Card (x{props.pointCards.length.toString()})</span>
                  </ClosedCard>
                )}
              </div>
            </>
          ) : (
            ''
          )}
          {props.coins.some((c: number) => c) ? (
            <>
              <div className={styles.playerOverview__separator}>
                <span className={styles.playerOverview__separatorText}>coins</span>
              </div>
              <div className={styles.playerOverview__coins}>
                {props.coins.map((c: number, i: number) => (
                  <Coin key={i} type={i === 0 ? 'gold' : i === 1 ? 'silver' : undefined}>
                    {c}
                  </Coin>
                ))}
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Player
