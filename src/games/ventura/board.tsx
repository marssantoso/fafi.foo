import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { ActionCard, PointCard, PlayerState } from '~/games/ventura/types.ts'
import { BoardProps } from 'boardgame.io/react'

// components
import Inventory from './components/inventory.tsx'
import Player from './components/player.tsx'
import PointCardComponent from './components/pointCard.tsx'
import ActionCardComponent from './components/actionCard.tsx'

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
    const matchPlayers = matchData?.filter(({ name }) => name) ?? []
    const players = G.players.map((p: PlayerState, i: number) => ({
      ...p,
      ...matchPlayers[i],
      isActive: ctx.currentPlayer === i.toString(),
    }))
    setPlayers(players)
  }, [G, ctx.currentPlayer, matchData])

  return (
    <div>
      <h1 className="page__title">Ventura Unlimited</h1>
      <div className={styles.wrapper}>
        <div className={styles.players}>
          {players.map(({ name, gems, isActive }, i) => (
            <Player key={i} name={name} gems={gems} isActive={isActive} />
          ))}
        </div>
        <div className={styles.board}>
          {!G.isStarted ? (
            <div>
              <button onClick={() => moves.startGame()}>Start</button>
            </div>
          ) : (
            <div className={styles.table}>
              <div className="gems"></div>
              <div className={styles.cards}>
                {pointCards.map(({ point, price }, i) => (
                  <PointCardComponent key={i} point={point} price={price} />
                ))}
                <div className={styles.closedCard}></div>
              </div>
              <div className={styles.cards}>
                {actionCards.map((c, i) => (
                  <ActionCardComponent key={i} {...c} />
                ))}
                <div className={styles.closedCard}></div>
              </div>
              {player ? (
                <div className={styles.cards}>
                  <div className={styles.closedCard}></div>
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
          {G.isStarted && player ? (
            <>
              <div className={styles.hand}>
                <div className={styles.inventory}>
                  <Inventory gems={player.gems} isLarge />
                </div>
                <div className={styles.actionCards}>
                  {player.actionCards.map((c: ActionCard, i: number) => (
                    <ActionCardComponent key={i} {...c} />
                  ))}
                </div>
                <div className="coins"></div>
                <div className={styles.pointCards}>
                  {player.pointCards.map(({ point, price }: PointCard, i: number) => (
                    <PointCardComponent key={i} point={point} price={price} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
