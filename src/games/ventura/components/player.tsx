import { PlayerState } from '../types'
import Inventory from './inventory.tsx'
import styles from './styles.module.css'
import ActionCardComponent from '~/games/ventura/components/actionCard.tsx'
import ClosedCard from '~/games/ventura/components/closedCard.tsx'
import { useState } from "react";

interface Props extends PlayerState {
  isFull?: boolean
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
          {/*<span className={`${styles.point} ${styles['point--small']}`}>{sumPoint(props)}</span>*/}
        </p>
        <Inventory gems={props.gems} />
      </div>
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
          {props.used.length ? <div className={styles.playerOverview__separator}>
            <span className={styles.playerOverview__separatorText}>used</span>
          </div> : ''}
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
                <ClosedCard isSmall>
                  <span>Point Card (x{props.pointCards.length.toString()})</span>
                </ClosedCard>
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
