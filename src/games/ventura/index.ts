import { Game } from 'boardgame.io'
import { INVALID_MOVE } from 'boardgame.io/core'
import { INITIAL_PLAYER_STATE, MAX_POINT_CARD, STARTER_ACTION_CARDS } from './constants'
import {
  addGems,
  gemsToPieces,
  generateActionCards,
  generateCards,
  getInitialGemsByPlayerId, hasEnoughGems, multiplyGems,
  piecesToGems,
  randomizeActionCard,
  randomizePointCard, subtractGems,
  sumPoint
} from "./utils";
import type { GameState } from './types'

export const Ventura: Game<GameState> = {
  name: 'ventura',
  setup: (_, setupData) => {
    const pointCards = generateCards(5)
    const actionCards = generateActionCards(6, STARTER_ACTION_CARDS)
    return {
      ...setupData,
      isStarted: false,
      generatedPointCards: [...pointCards],
      generatedActionCards: [...STARTER_ACTION_CARDS, ...actionCards],
      pointCards: [...pointCards],
      actionCards: [...actionCards],
      actionGems: Array(6).fill(0),
      coins: [5, 7],
      gems: [40, 30, 20, 10],
      players: [],
    }
  },
  turn: {
    minMoves: 1,
    maxMoves: 2,
    stages: {
      discard: {
        moves: {
          updateGems: ({ G }, playerID, gems) => {
            G.players[playerID].gems = gems
          },
        },
      },
    },
    onMove: ({ G, ctx, events }) => {
      const gems = G.players[parseInt(ctx.currentPlayer)].gems.reduce((a, b) => a + b, 0)
      if (gems > 10) {
        events.setActivePlayers({ value: { [ctx.currentPlayer]: 'discard' } })
      } else {
        events.endTurn()
      }
    }
  },
  moves: {
    initPlayer: {
      noLimit: true,
      move: ({ G }, playerID: number) => {
        if (G.isStarted) return INVALID_MOVE
        G.players[playerID] = { ...INITIAL_PLAYER_STATE }
      },
    },
    startGame: {
      noLimit: true,
      move: ({ G, ctx }) => {
        if (G.isStarted || ctx.currentPlayer !== '0') return INVALID_MOVE
        G.players.forEach((_p, i) => {
          G.players[i].gems = getInitialGemsByPlayerId(i)
          G.players[i].actionCards = [...STARTER_ACTION_CARDS]
        })
        G.coins = [G.players.length * 2, G.players.length]
        G.isStarted = true
      },
    },
    takeActionCard: ({ G }, { playerID, cardID, gems }) => {
      const card = G.actionCards[cardID]
      const player = G.players[playerID]
      const totalGems = gems.reduce((prev: number, curr: number) => prev + curr, 0)
      if (!card || totalGems < cardID) return INVALID_MOVE

      // add action card from table to player
      G.players[playerID].actionCards = [...player.actionCards, card]
      G.actionCards = G.actionCards.filter((_g, i) => i !== cardID)

      // put new action card on the table
      const newCard = randomizeActionCard(G.generatedActionCards)
      G.actionCards.push(newCard)
      G.generatedActionCards.push(newCard)

      // deduct player's gems if needed to pay
      G.players[playerID].gems = [
        player.gems[0] - gems[0],
        player.gems[1] - gems[1],
        player.gems[2] - gems[2],
        player.gems[3] - gems[3],
      ]

      // add action gems from table to player if any
      if (G.actionGems[cardID]) {
        G.players[playerID].gems = piecesToGems([
          ...gemsToPieces(G.players[playerID].gems),
          ...gemsToPieces(G.actionGems[cardID]),
        ])
        G.actionGems.shift()
      }

      // put gems paid by player onto each action card
      gemsToPieces(gems).forEach((g, i) => {
        G.actionGems[i] = G.actionGems[i] ? piecesToGems([...gemsToPieces(G.actionGems[i]), g]) : piecesToGems([g])
      })
    },
    buyPointCard: ({ G }, { playerID, cardID }) => {
      const card = G.pointCards[cardID]
      const player = G.players[playerID]
      if (card?.price.some((p, i) => p > player.gems[i])) return INVALID_MOVE
      G.players[playerID].pointCards = [...player.pointCards, card]
      G.players[playerID].gems = [
        player.gems[0] - card.price[0],
        player.gems[1] - card.price[1],
        player.gems[2] - card.price[2],
        player.gems[3] - card.price[3],
      ]
      G.pointCards = G.pointCards.filter((_g, i) => i !== cardID)

      // put a new point card on the table
      const newCard = randomizePointCard(G.generatedPointCards)
      G.pointCards.push(newCard)
      G.generatedPointCards.push(newCard)

      // put coins from the table to player (if any)
      if (G.coins[cardID]) {
        G.coins[cardID] -= 1
        G.players[playerID].coins[cardID] += 1
      }
    },
    playActionCard: ({ G }, { playerID, cardID, times = 1, upgrade }) => {
      const player = G.players[playerID]
      const card = player.actionCards[cardID]

      if (card.gain) {
        G.players[playerID].gems = addGems(player.gems, card.gain)
      } else if (card.exchange) {
        const gemsToExchange = multiplyGems(card.exchange[0], times)
        const gemsToReceive = multiplyGems(card.exchange[1], times)
        if (!hasEnoughGems(player.gems, gemsToExchange)) return INVALID_MOVE
        G.players[playerID].gems = subtractGems(addGems(player.gems, gemsToReceive), gemsToExchange)
      } else if (card.upgrade) {
        if (!piecesToGems(player.gems).length || !hasEnoughGems(player.gems, upgrade[0])) return INVALID_MOVE
        G.players[playerID].gems = subtractGems(addGems(player.gems, upgrade[1]), upgrade[0])
      }

      G.players[playerID].actionCards = player.actionCards.filter((_g, i) => i !== cardID)
      G.players[playerID].used = [...player.used, card]
    },
    rest: ({ G }, id) => {
      G.players[id].actionCards = [...G.players[id].actionCards, ...G.players[id].used]
      G.players[id].used = []
    },
  },
  endIf: ({ G, ctx }) => {
    if (G.players.some((p) => p.pointCards.length >= MAX_POINT_CARD)) {
      const winner = G.players.reduce(
        (prev, curr, i, a) => (sumPoint(curr) >= sumPoint(a[prev]) ? i : prev),
        parseInt(ctx.currentPlayer)
      )
      return { winner, point: sumPoint(G.players[winner]) }
    }
  },
}
