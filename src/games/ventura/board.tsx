import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { BoardProps } from 'boardgame.io/react'
import type { ActionCard, PointCard, PlayerState, OnClickCard, Gems } from './types.ts'
import {
  gemsToPieces,
  getAvailableUpgrade,
  getMaxExchange,
  multiplyGems,
  piecesToGems,
  sortGems,
  sumPoint
} from "./utils.ts";

// components
import Inventory from './components/inventory.tsx'
import Player from './components/player.tsx'
import Price from './components/price.tsx'
import PointCardComponent from './components/pointCard.tsx'
import ActionCardComponent from './components/actionCard.tsx'
import ClosedCard from './components/closedCard.tsx'
import Coin from './components/coin.tsx'
import GemTiers from './components/gemTiers.tsx'

type Dialog = 'takeActionCard' | 'playActionUpgrade' | 'playActionExchange' | 'playActionGain' | 'discardGems'

export const VenturaBoard = ({ ctx, G, playerID, matchData, moves }: BoardProps) => {
  const [players, setPlayers] = useState<PlayerState[]>([])
  const [selectedGems, setSelectedGems] = useState<number[]>([])
  const [selectedPieces, setSelectedPieces] = useState<number[]>([])
  const [selectedCard, setSelectedCard] = useState<{ card: ActionCard | PointCard; cardID: number } | null>(null)
  const [availableUpgrades, setAvailableUpgrades] = useState<Gems[]>([])
  const [selectedUpgrade, setSelectedUpgrade] = useState<number | null>(null)
  const [selectedExchange, setSelectedExchange] = useState<number>(1)
  const [dialogs, setDialogs] = useState<Record<Dialog, boolean>>({
    takeActionCard: false,
    playActionUpgrade: false,
    playActionExchange: false,
    playActionGain: false,
    discardGems: false,
  })

  const pointCards: PointCard[] = G.pointCards
  const actionCards: ActionCard[] = G.actionCards
  const player = playerID ? G.players[playerID] : null
  const gemsAmount = player?.gems.reduce((a: number, b: number) => a + b, 0)
  const isStageDiscard = Boolean(playerID && ctx.activePlayers?.[playerID])

  // start the game once all players have connected
  useEffect(() => {
    if (players.length === ctx.numPlayers) {
      moves.startGame()
    }
  }, [ctx.numPlayers, moves, players.length]);

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
      setSelectedPieces([])
      setAvailableUpgrades([])
      setSelectedUpgrade(null)
      setSelectedExchange(1)
    }
  }, [dialogs])

  // handles inventory overload
  useEffect(() => {
    if (isStageDiscard) {
      toggleDialog('discardGems', true)
    }
  }, [isStageDiscard]);

  // announce winner
  useEffect(() => {
    const winner = matchData && ctx.gameover ? matchData[ctx.gameover.winner] : undefined
    if (winner) {
      const msg = `GAMEOVER. Winner is "${winner.name}" with ${ctx.gameover.point} pts`
      alert(msg)
    }
  }, [ctx, matchData]);

  const toggleDialog = (d: Dialog, value?: boolean) => {
    setDialogs((state) => {
      const newState: Record<string, boolean> = {}
      for (const key in state) {
        newState[key] = key !== d ? false : value === undefined ? !state[d] : value
      }
      // TODO: handle state when opening dialog where another dialog is still open
      return newState
    })
  }

  const onSelectGems = (i: number) => {
    if (!player?.gems) return []
    const gems = selectedGems.includes(i) ? selectedGems.filter((j) => i !== j) : [...selectedGems, i]
    const pieces = gems.map((i) => gemsToPieces(player.gems)[i])
    setSelectedGems(gems)
    setSelectedPieces(pieces)
    return pieces
  }

  const onSelectGemsForUpgrade = (i: number) => {
    if (!selectedCard) return
    const { upgrade } = selectedCard.card as ActionCard
    const selectedPieces = onSelectGems(i)
    const upgrades = getAvailableUpgrade(selectedPieces, upgrade)
    setAvailableUpgrades(upgrades.map((u) => piecesToGems(u)).sort(sortGems))
  }

  const onConfirmSelectGems = () => {
    if (!selectedCard) return
    const gems = piecesToGems(selectedPieces)
    const totalGems = gems.reduce((prev: number, curr: number) => prev + curr, 0)
    const { card, cardID } = selectedCard
    if (totalGems < cardID) return

    moves.takeActionCard({ playerID, cardID, gems, card })
    toggleDialog('takeActionCard', false)
  }

  const onConfirmUpgrade = () => {
    if (!selectedCard || selectedUpgrade === null) return
    const { card, cardID } = selectedCard
    const upgrade = [piecesToGems(selectedPieces), availableUpgrades[selectedUpgrade]]

    moves.playActionCard({ playerID, cardID, upgrade, card })
    toggleDialog('playActionUpgrade', false)
  }

  const onConfirmExchange = () => {
    if (!selectedCard) return
    const { card, cardID } = selectedCard
    moves.playActionCard({ playerID, cardID, times: selectedExchange, card })
    toggleDialog('playActionExchange', false)
  }

  const onConfirmDiscardGems = () => {
    if (gemsAmount - selectedGems.length > 10) return
    const newGems = gemsToPieces(player.gems, gemsAmount).filter((_, i) => !selectedGems.includes(i))
    moves.updateGems(playerID, piecesToGems(newGems))
    toggleDialog('discardGems', false)
  }

  const onAutoDiscardGems = () => {
    const newGems = gemsToPieces(player.gems, gemsAmount).slice(gemsAmount - 10)
    moves.updateGems(playerID, piecesToGems(newGems))
    toggleDialog('discardGems', false)
  }

  const onTakeActionCard: OnClickCard<ActionCard> = (card?: ActionCard, cardID?: number) => {
    if (!card || cardID === undefined || ctx.currentPlayer !== playerID || gemsToPieces(player.gems).length < cardID) return
    if (!cardID) return moves.takeActionCard({ playerID, cardID, gems: [0, 0, 0, 0], card })

    setSelectedCard({ card, cardID })
    toggleDialog('takeActionCard')
  }

  const onPlayActionCard: OnClickCard<ActionCard> = (card?: ActionCard, cardID?: number) => {
    if (!card || cardID === undefined || ctx.currentPlayer !== playerID) return
    setSelectedCard({ card, cardID })

    if (card.gain) return moves.playActionCard({ playerID, cardID, card })
    if (card.upgrade) return toggleDialog('playActionUpgrade', true)
    if (card.exchange) return toggleDialog('playActionExchange', true)
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
          <GemTiers />
          {players.map(({ name, gems, isActive }, i) => (
            <Player key={i} name={name} gems={gems} isActive={isActive} point={sumPoint(G.players[i])} />
          ))}
        </div>
        <div className={styles.board}>
          {!G.isStarted ? (
            <div>
              <p style={{ marginTop: 'unset' }}>Waiting for players... ({players.length}/{ctx.numPlayers})</p>
            </div>
          ) : (
            <div className={styles.table}>
              <div className="gems"></div>
              <div className={styles.cards}>
                {pointCards.map((card, i) => (
                  <div key={i} className={styles.pointCard}>
                    <PointCardComponent {...card} onClick={() => onBuyPointCard(card, i)} />
                    <Coin type={i === 0 ? 'gold' : i === 1 ? 'silver' : undefined}>{G.coins[i]}</Coin>
                  </div>
                ))}
                <ClosedCard>Point Card</ClosedCard>
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
                  <fieldset className={styles.fieldset}>
                    <legend style={{ marginTop: 'unset', fontSize: 12 }}>Select gems to pay ({selectedCard?.cardID})</legend>
                    <Inventory
                      gems={player.gems}
                      isLarge
                      isSelectable
                      selected={selectedGems}
                      onSelect={onSelectGems}
                    />
                  </fieldset>
                  <button style={{ marginTop: 12, marginRight: 8 }} onClick={onConfirmSelectGems}>
                    Confirm
                  </button>
                  <button onClick={() => toggleDialog('takeActionCard', false)}>Cancel</button>
                </dialog>
                <dialog open={dialogs.playActionUpgrade}>
                  <fieldset className={styles.fieldset}>
                    <legend style={{ marginTop: 'unset', fontSize: 12 }}>Select gems to upgrade</legend>
                    <Inventory
                      gems={player.gems}
                      isLarge
                      isSelectable
                      selected={selectedGems}
                      onSelect={onSelectGemsForUpgrade}
                    />
                  </fieldset>
                  {availableUpgrades.length ? (
                    <fieldset className={styles.fieldset}>
                      <legend style={{ marginTop: 'unset', fontSize: 12 }}>Select what to upgrade to</legend>
                      <div className={styles.upgrades}>
                        {availableUpgrades.map((g, i) => (
                          <label
                            key={i}
                            className={`${styles.upgrade} ${selectedUpgrade === i ? styles['upgrade--checked'] : ''}`}
                          >
                            <input
                              type="radio"
                              name="upgrade"
                              value={i}
                              checked={selectedUpgrade === i}
                              onChange={() => setSelectedUpgrade(i)}
                            />
                            <Price price={g} />
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : (
                    <></>
                  )}
                  <button style={{ marginTop: 12, marginRight: 8 }} onClick={onConfirmUpgrade}>
                    Confirm
                  </button>
                  <button onClick={() => toggleDialog('playActionUpgrade', false)}>Cancel</button>
                </dialog>
                <dialog open={dialogs.playActionExchange}>
                  <fieldset className={styles.fieldset}>
                    <legend style={{ marginTop: 'unset', fontSize: 12 }}>Choose how many to exchange</legend>
                    <input
                      type="number"
                      value={selectedExchange}
                      min={1}
                      max={getMaxExchange(
                        player.gems,
                        (selectedCard?.card as ActionCard)?.exchange?.[0] ?? [0, 0, 0, 0]
                      )}
                      onInput={(e) => setSelectedExchange(parseInt((e.target as HTMLInputElement).value))}
                    />
                  </fieldset>
                  <fieldset className={styles.fieldset}>
                    <legend style={{ marginTop: 'unset', fontSize: 12 }}>Here's what you'll exchange</legend>
                    <Inventory
                      gems={multiplyGems(
                        (selectedCard?.card as ActionCard)?.exchange?.[0] ?? [0, 0, 0, 0],
                        selectedExchange
                      )}
                    />
                  </fieldset>
                  <fieldset className={styles.fieldset}>
                    <legend style={{ marginTop: 'unset', fontSize: 12 }}>Here's what you'll receive</legend>
                    <Inventory
                      gems={multiplyGems(
                        (selectedCard?.card as ActionCard)?.exchange?.[1] ?? [0, 0, 0, 0],
                        selectedExchange
                      )}
                    />
                  </fieldset>
                  <button style={{ marginTop: 12, marginRight: 8 }} onClick={onConfirmExchange}>
                    Confirm
                  </button>
                  <button onClick={() => toggleDialog('playActionExchange', false)}>Cancel</button>
                </dialog>
                <dialog open={dialogs.discardGems}>
                  <fieldset className={styles.fieldset}>
                    <legend style={{ marginTop: 'unset', fontSize: 12 }}>Select gems to discard:</legend>
                    <Inventory
                      amount={gemsAmount}
                      gems={player.gems}
                      selected={selectedGems}
                      isLarge
                      isSelectable
                      onSelect={onSelectGems}
                    />
                  </fieldset>
                  <button style={{ marginTop: 12, marginRight: 8 }} onClick={onConfirmDiscardGems}>
                    Discard
                  </button>
                  <button onClick={onAutoDiscardGems}>Auto Discard</button>
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
                  {player.coins.some((c: number) => c) ? <div className={styles.coins}>
                    {player.coins.map((c: number, i: number) => <Coin key={i} type={i === 0 ? 'gold' : i === 1 ? 'silver' : undefined}>{c}</Coin>)}
                  </div> : <></>}
                </div>
                <div className={styles.actionCards}>
                  {player.actionCards.map((card: ActionCard, i: number) => (
                    <ActionCardComponent key={i} {...card} onClick={() => onPlayActionCard(card, i)} />
                  ))}
                </div>
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
