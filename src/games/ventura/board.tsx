import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import {ActionCard, PointCard, PlayerState} from '~/games/ventura/types.ts'
import { BoardProps } from 'boardgame.io/react'

// components
import Inventory from "./components/inventory.tsx";
import Player from "./components/player.tsx";

export const VenturaBoard = ({ ctx, G, playerID, matchData, moves }: BoardProps) => {
  const [players, setPlayers] = useState<PlayerState[]>([])
  const pointCards: PointCard[] = G.pointCards
  const actionCards: ActionCard[] = G.actionCards
  const player = playerID ? G.players[playerID] : null

  // insert new player to G.players
  useEffect(() => {
    if (playerID !== '0') return
    const newPlayer = matchData?.find(({ id, isConnected }) => isConnected && !G.players[id])
    if (!newPlayer) return
    moves.initPlayer(newPlayer.id)
  }, [G, playerID, matchData, moves])

  // populate players state to render
  useEffect(() => {
    const matchPlayers = matchData?.filter(({name}) => name) ?? []
    const players = G.players.map((p: PlayerState, i: number) => ({ ...p, ...matchPlayers[i], isActive: ctx.currentPlayer === i.toString() }))
    setPlayers(players)
  }, [G, ctx.currentPlayer, matchData]);

  return (
    <div>
      <h1>Ventura</h1>
      <div className={styles.wrapper}>
        <div className={styles.players}>
          {players.map(({ name, gems, isActive }, i) => (
            /*<div key={i} className={styles.playerCard}>
              <p>
                {name}
                {isActive ? '*' : ''}
              </p>
              <Inventory gems={gems} />
            </div>*/
            <Player key={i} name={name} gems={gems} isActive={isActive} />
          ))}
        </div>
        {!G.isStarted ? (
          <button onClick={() => moves.startGame()}>Start</button>
        ) : (
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
            {player ? (
              <>
                <div className={styles.hand}>
                  <div className={styles.inventory}>
                    <Inventory gems={player.gems} isLarge />
                  </div>
                  <div className={styles.cards}>
                    <div className={`${styles.card} ${styles['pointCard--closed']}`}></div>
                  </div>
                  <div className={styles.cards}>
                    <div className={`${styles.card} ${styles['actionCard--closed']}`}></div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
