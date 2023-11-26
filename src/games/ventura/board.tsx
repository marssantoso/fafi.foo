import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { BoardProps } from 'boardgame.io/react'
import { useDialog } from '~/hooks'
import type { ActionCard, PointCard, PlayerState, OnClickCard, Gems } from './types.ts'
import {
  gemsToPieces,
  getAvailableUpgrade,
  getMaxExchange,
  hasEnoughGems,
  multiplyGems,
  piecesToGems,
  sortGems,
} from './utils.ts'

// components
import Inventory from './components/inventory.tsx'
import Player from './components/player.tsx'
import Price from './components/price.tsx'
import PointCardComponent from './components/pointCard.tsx'
import ActionCardComponent from './components/actionCard.tsx'
import ClosedCard from './components/closedCard.tsx'
import Coin from './components/coin.tsx'
import GemTiers from './components/gemTiers.tsx'
import Dialog from './components/dialog.tsx'

export const VenturaBoard = ({ ctx, G, playerID, matchData, moves }: BoardProps) => {
  const [players, setPlayers] = useState<PlayerState[]>([])
  const [selectedGems, setSelectedGems] = useState<number[]>([])
  const [selectedPieces, setSelectedPieces] = useState<number[]>([])
  const [selectedCard, setSelectedCard] = useState<{ card: ActionCard | PointCard; cardID: number } | null>(null)
  const [availableUpgrades, setAvailableUpgrades] = useState<Gems[]>([])
  const [selectedUpgrade, setSelectedUpgrade] = useState<number | null>(null)
  const [selectedExchange, setSelectedExchange] = useState<number>(1)

  const pointCards: PointCard[] = G.pointCards
  const actionCards: ActionCard[] = G.actionCards
  const player: PlayerState | null = playerID ? G.players[playerID] : null
  const gemsAmount = player?.gems.reduce((a: number, b: number) => a + b, 0) ?? 0
  const isStageDiscard = Boolean(playerID && ctx.activePlayers?.[playerID])

  // dialogs
  const { isOpen: isPlayersOverviewOpen, openDialog: openPlayersOverviewDialog, closeDialog: closePlayersOverviewDialog } = useDialog()
  const { isOpen: isUsedCardsOpen, openDialog: openUsedCardsDialog, closeDialog: closeUsedCardsDialog } = useDialog()
  const { isOpen: isDiscardGemsOpen, openDialog: openDiscardGemsDialog, closeDialog: closeDiscardGemsDialog } = useDialog()
  const { isOpen: isTakeActionCardOpen, openDialog: openTakeActionCardDialog, closeDialog: closeTakeActionCardDialog } = useDialog()
  const { isOpen: isActionExchangeOpen, openDialog: openActionExchangeDialog, closeDialog: closeActionExchangeDialog } = useDialog()
  const { isOpen: isActionUpgradeOpen, openDialog: openActionUpgradeDialog, closeDialog: closeActionUpgradeDialog } = useDialog()

  // start the game once all players have connected
  useEffect(() => {
    if (!G.isStarted && players.length === ctx.numPlayers) {
      moves.startGame()
    }
  }, [G.isStarted, ctx.numPlayers, moves, players.length])

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
    const dialogs = [isActionExchangeOpen, isActionUpgradeOpen, isDiscardGemsOpen, isPlayersOverviewOpen, isTakeActionCardOpen, isUsedCardsOpen]
    if (Object.values(dialogs).every((v) => !v)) {
      setSelectedGems([])
      setSelectedCard(null)
      setSelectedPieces([])
      setAvailableUpgrades([])
      setSelectedUpgrade(null)
      setSelectedExchange(1)
    }
  }, [isActionExchangeOpen, isActionUpgradeOpen, isDiscardGemsOpen, isPlayersOverviewOpen, isTakeActionCardOpen, isUsedCardsOpen])

  // handles inventory overload
  useEffect(() => {
    if (isStageDiscard) openDiscardGemsDialog()
  }, [isStageDiscard, openDiscardGemsDialog])

  // announce winner
  useEffect(() => {
    const winner = matchData && ctx.gameover ? matchData[ctx.gameover.winner] : undefined
    if (winner) openPlayersOverviewDialog()
  }, [ctx.gameover, matchData, openPlayersOverviewDialog])

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

  const onConfirmTakeActionCard = () => {
    if (!selectedCard) return
    const gems = piecesToGems(selectedPieces)
    const totalGems = gems.reduce((prev: number, curr: number) => prev + curr, 0)
    const { card, cardID } = selectedCard
    if (totalGems < cardID) return

    moves.takeActionCard({ playerID, cardID, gems, card })
    closeTakeActionCardDialog()
  }

  const onConfirmUpgrade = () => {
    if (!selectedCard || selectedUpgrade === null) return
    const { card, cardID } = selectedCard
    const upgrade = [piecesToGems(selectedPieces), availableUpgrades[selectedUpgrade]]

    moves.playActionCard({ playerID, cardID, upgrade, card })
    closeActionUpgradeDialog()
  }

  const onConfirmExchange = () => {
    if (!selectedCard) return
    const { card, cardID } = selectedCard
    moves.playActionCard({ playerID, cardID, times: selectedExchange, card })
    closeActionExchangeDialog()
  }

  const onConfirmDiscardGems = () => {
    if (!player || gemsAmount - selectedGems.length > 10) return
    const newGems = gemsToPieces(player.gems, gemsAmount).filter((_, i) => !selectedGems.includes(i))
    moves.updateGems(playerID, piecesToGems(newGems))
    closeDiscardGemsDialog()
  }

  const onAutoDiscardGems = () => {
    if (!player) return
    const newGems = gemsToPieces(player.gems, gemsAmount).slice(gemsAmount - 10)
    moves.updateGems(playerID, piecesToGems(newGems))
    openDiscardGemsDialog()
  }

  const onTakeActionCard: OnClickCard<ActionCard> = (card?: ActionCard, cardID?: number) => {
    if (!player || !card || cardID === undefined || ctx.currentPlayer !== playerID || gemsToPieces(player.gems).length < cardID) return
    if (!cardID) return moves.takeActionCard({ playerID, cardID, gems: [0, 0, 0, 0], card })

    setSelectedCard({ card, cardID })
    openTakeActionCardDialog()
  }

  const onPlayActionCard: OnClickCard<ActionCard> = (card?: ActionCard, cardID?: number) => {
    if (!player || !card || cardID === undefined || ctx.currentPlayer !== playerID) return
    setSelectedCard({ card, cardID })

    if (card.gain) return moves.playActionCard({ playerID, cardID, card })
    if (card.upgrade) return openActionUpgradeDialog()
    if (card.exchange) {
      if (!hasEnoughGems(player.gems, card.exchange[0])) return
      return openActionExchangeDialog()
    }
  }

  const onBuyPointCard: OnClickCard<PointCard> = (card?: PointCard, cardID?: number) => {
    if (ctx.currentPlayer !== playerID) return
    moves.buyPointCard({ playerID, cardID, card })
  }

  const onTakeBackUsedPile = () => {
    if (ctx.currentPlayer !== playerID) return
    moves.rest(playerID)
    closeUsedCardsDialog()
  }

  return (
    <div>
      <h1 className="page__title">Ventura Unlimited</h1>
      <div className={styles.wrapper}>
        <div className={styles.players}>
          <GemTiers />
          {players.map((player, i) => (
            <Player key={i} {...player} />
          ))}
          <button style={{ width: 'calc(100% - 8px)', margin: 4 }} onClick={openPlayersOverviewDialog}>
            Overview
          </button>
        </div>
        <div className={styles.board}>
          {!G.isStarted ? (
            <div>
              <p style={{ marginTop: 'unset' }}>
                Waiting for players... ({players.length}/{ctx.numPlayers})
              </p>
            </div>
          ) : (
            <div className={styles.table}>
              <div className={styles.cards}>
                {pointCards.map((card, i) => (
                  <div key={i} className={styles.pointCard}>
                    <PointCardComponent {...card} onClick={() => onBuyPointCard(card, i)} />
                    <Coin type={i === 0 ? 'gold' : i === 1 ? 'silver' : undefined}>{G.coins[i]}</Coin>
                  </div>
                ))}
                <ClosedCard type="point">Point Card</ClosedCard>
              </div>
              <div className={styles.cards}>
                {actionCards.map((card, i) => (
                  <div className={styles.actionCard} key={i}>
                    <ActionCardComponent {...card} onClick={() => onTakeActionCard(card, i)} />
                    <div style={{ padding: 8 }}>{G.actionGems[i] ? <Price price={G.actionGems[i]} /> : <></>}</div>
                  </div>
                ))}
                <ClosedCard type="action">Action Card</ClosedCard>
              </div>
              {player ? (
                <div className={styles.cards}>
                  <ClosedCard type="action" onClick={() => player.used.length && openUsedCardsDialog()}>
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
                  {player.coins.some((c: number) => c) ? (
                    <div className={styles.coins}>
                      {player.coins.map((c: number, i: number) => (
                        <Coin key={i} type={i === 0 ? 'gold' : i === 1 ? 'silver' : undefined}>
                          {c}
                        </Coin>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
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
              <Dialog open={isTakeActionCardOpen} title="Take Action Card" confirmLabel="Confirm" closeLabel="Cancel" onConfirm={onConfirmTakeActionCard} onClose={closeTakeActionCardDialog}>
                <fieldset className={styles.fieldset}>
                  <legend style={{ marginTop: 'unset', fontSize: 12 }}>
                    Select gems to pay ({selectedCard?.cardID})
                  </legend>
                  <Inventory gems={player.gems} isLarge isSelectable selected={selectedGems} onSelect={onSelectGems} />
                </fieldset>
              </Dialog>
              <Dialog open={isActionUpgradeOpen} title="Upgrade" confirmLabel="Confirm" closeLabel="Cancel" onConfirm={onConfirmUpgrade} onClose={closeActionUpgradeDialog}>
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
              </Dialog>
              <Dialog open={isActionExchangeOpen} title="Exchange" confirmLabel="Confirm" closeLabel="Cancel" onConfirm={onConfirmExchange} onClose={closeActionExchangeDialog}>
                <fieldset className={styles.fieldset}>
                  <legend style={{ marginTop: 'unset', fontSize: 12 }}>Multiplier</legend>
                  <input
                    type="number"
                    value={selectedExchange}
                    min={1}
                    max={getMaxExchange(player.gems, (selectedCard?.card as ActionCard)?.exchange?.[0] ?? [0, 0, 0, 0])}
                    onInput={(e) => setSelectedExchange(parseInt((e.target as HTMLInputElement).value))}
                  />
                </fieldset>
                <fieldset className={styles.fieldset}>
                  <legend style={{ marginTop: 'unset', fontSize: 12 }}>To exchange</legend>
                  <Inventory
                    gems={multiplyGems(
                      (selectedCard?.card as ActionCard)?.exchange?.[0] ?? [0, 0, 0, 0],
                      selectedExchange
                    )}
                  />
                </fieldset>
                <fieldset className={styles.fieldset}>
                  <legend style={{ marginTop: 'unset', fontSize: 12 }}>To receive</legend>
                  <Inventory
                    gems={multiplyGems(
                      (selectedCard?.card as ActionCard)?.exchange?.[1] ?? [0, 0, 0, 0],
                      selectedExchange
                    )}
                  />
                </fieldset>
              </Dialog>
              <Dialog
                open={isPlayersOverviewOpen}
                title={matchData && ctx.gameover ? `${matchData[ctx.gameover.winner]?.name?.toUpperCase()} Won with ${ctx.gameover.point} pts` : 'Players Overview'}
                confirmLabel={ctx.gameover ? '' : 'Close'}
                onConfirm={closePlayersOverviewDialog}
              >
                <>
                  {players.map((player, i) => <Player key={i} {...player} isFull isRevealed={ctx.gameover} />)}
                </>
              </Dialog>
              <Dialog open={isUsedCardsOpen} title="Used Cards" confirmLabel={ctx.currentPlayer === playerID ? 'Rest' : ''} closeLabel="Close" onConfirm={onTakeBackUsedPile} onClose={closeUsedCardsDialog}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  {player.used.map((c) => (
                    <ActionCardComponent {...c} isSmall />
                  ))}
                </div>
              </Dialog>
              <Dialog open={isDiscardGemsOpen} title="Select to Discard" confirmLabel="Discard" closeLabel="Auto Discard" onConfirm={onConfirmDiscardGems} onClose={onAutoDiscardGems}>
                <Inventory
                  amount={gemsAmount}
                  gems={player.gems}
                  selected={selectedGems}
                  isLarge
                  isSelectable
                  onSelect={onSelectGems}
                />
              </Dialog>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
