import { Game } from 'boardgame.io'
import { INVALID_MOVE } from 'boardgame.io/core'
import { INITIAL_PLAYER_STATE, MAX_POINT_CARD, STARTER_ACTION_CARDS } from './constants'
import {
  gemsToPieces,
  generateActionCards,
  generateCards,
  getInitialGemsByPlayerId,
  piecesToGems,
  randomizeActionCard,
  randomizePointCard,
  sumPoint,
} from './utils'
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
        G.players[playerID].gems = [
          player.gems[0] + card.gain[0],
          player.gems[1] + card.gain[1],
          player.gems[2] + card.gain[2],
          player.gems[3] + card.gain[3],
        ]
      } else if (card.exchange) {
        // TODO: validate = if (times = 0 || gems not enough)
        G.players[playerID].gems = [
          player.gems[0] - card.exchange[0][0] * times + card.exchange[1][0] * times,
          player.gems[1] - card.exchange[0][1] * times + card.exchange[1][1] * times,
          player.gems[2] - card.exchange[0][2] * times + card.exchange[1][2] * times,
          player.gems[3] - card.exchange[0][3] * times + card.exchange[1][3] * times,
        ]
      } else if (card.upgrade) {
        // TODO: validate = if (gems = 0)
        G.players[playerID].gems = [
          player.gems[0] + upgrade[1][0] - upgrade[0][0],
          player.gems[1] + upgrade[1][1] - upgrade[0][1],
          player.gems[2] + upgrade[1][2] - upgrade[0][2],
          player.gems[3] + upgrade[1][3] - upgrade[0][3],
        ]
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
