import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { BoardProps } from 'boardgame.io/react'
import type { ActionCard, PointCard, PlayerState, OnClickCard } from './types.ts'
import { gemsToPieces, piecesToGems } from './utils.ts'

// components
import Inventory from './components/inventory.tsx'
import Player from './components/player.tsx'
import Price from './components/price.tsx'
import PointCardComponent from './components/pointCard.tsx'
import ActionCardComponent from './components/actionCard.tsx'
import ClosedCard from './components/closedCard.tsx'

export const VenturaBoard = ({ ctx, G, playerID, matchData, moves }: BoardProps) => {
  const [players, setPlayers] = useState<PlayerState[]>([])
  const [selectedGems, setSelectedGems] = useState<number[]>([])
  const [selectedCard, setSelectedCard] = useState<{ card: ActionCard | PointCard, cardID: number } | null>(null)
  const [dialogs, setDialogs] = useState<Record<string, boolean>>({ takeActionCard: false })

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

  // clear state when all dialogs close
  useEffect(() => {
    if (Object.values(dialogs).every((v) => !v)) {
      setSelectedGems([])
      setSelectedCard(null)
    }
  }, [dialogs]);

  const toggleDialog = (d: string, value?: boolean) => {
    setDialogs((state) => ({
      ...state,
      [d]: value === undefined ? !state[d] : value,
    }))
  }

  const onSelectGems = (i: number) => {
    setSelectedGems((state) => {
      if (!state.includes(i)) return [...state, i]
      return state.filter((j) => i !== j)
    })
  }

  const onConfirmSelectGems = () => {
    if (!selectedCard) return
    const pieces = gemsToPieces(player.gems)
    const gems = piecesToGems(selectedGems.map((i) => pieces[i]))
    const totalGems = gems.reduce((prev: number, curr: number) => prev + curr, 0)
    const { card, cardID } = selectedCard
    if (totalGems < cardID) return

    moves.takeActionCard({playerID, cardID, gems, card})
    toggleDialog('takeActionCard', false)
  }

  const onTakeActionCard: OnClickCard<ActionCard> = (card?: ActionCard, cardID?: number) => {
    if (!card || ctx.currentPlayer !== playerID) return
    if (!cardID) return moves.takeActionCard({playerID, cardID, gems: [0, 0, 0, 0], card})

    setSelectedCard({ card, cardID })
    toggleDialog('takeActionCard')
  }

  const onPlayActionCard: OnClickCard<ActionCard> = (card?: ActionCard, cardID?: number) => {
    if (ctx.currentPlayer !== playerID) return
    if (!card?.gain) {
      console.log('moves.playActionCard({playerID, cardID, times: 1, upgrade, card})')
      return
    }
    moves.playActionCard({playerID, cardID, card})
  }

  const onBuyPointCard: OnClickCard<PointCard> = (card?: PointCard, cardID?: number) => {
    if (ctx.currentPlayer !== playerID) return
    moves.buyPointCard({ playerID, cardID, card })
  }

  const onClickUsedPile = () => {
    if (ctx.currentPlayer !== playerID) return
    moves.rest(playerID)
  }

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
                {pointCards.map((card, i) => (
                  <PointCardComponent key={i} {...card} onClick={() => onBuyPointCard(card, i)} />
                ))}
                <ClosedCard >Point Card</ClosedCard>
              </div>
              <div className={styles.cards}>
                {actionCards.map((card, i) => (
                  <div className={styles.actionCard} key={i}>
                    <ActionCardComponent {...card} onClick={() => onTakeActionCard(card, i)} />
                    {G.actionGems[i] ? <Price price={G.actionGems[i]} /> : <></>}
                  </div>
                ))}
                <ClosedCard>Action Card</ClosedCard>
                <dialog open={dialogs.takeActionCard}>
                  <p style={{ marginTop: 'unset', fontSize: 12 }}>Select gems to pay</p>
                  <Inventory gems={player.gems} isLarge isSelectable selected={selectedGems} onSelect={onSelectGems} />
                  <button style={{ marginTop: 12, marginRight: 8 }} onClick={onConfirmSelectGems}>
                    Confirm
                  </button>
                  <button onClick={() => toggleDialog('takeActionCard', false)}>Cancel</button>
                </dialog>
              </div>
              {player ? (
                <div className={styles.cards}>
                  <ClosedCard onClick={onClickUsedPile}>
                    <span>Used (x{player.used.length})</span>
                  </ClosedCard>
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
                  {player.actionCards.map((card: ActionCard, i: number) => (
                    <ActionCardComponent key={i} {...card} onClick={() => onPlayActionCard(card, i)} />
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
