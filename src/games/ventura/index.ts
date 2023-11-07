import { Game } from 'boardgame.io'
import { INVALID_MOVE } from 'boardgame.io/core'
import { INITIAL_PLAYER_STATE, STARTER_ACTION_CARDS } from './constants'
import {
  gemsToPieces,
  generateActionCards,
  generateCards,
  getInitialGemsByPlayerId,
  piecesToGems,
  randomizeActionCard,
  randomizePointCard,
} from './utils'
import type { GameState } from './types'

export const Ventura: Game<GameState> = {
  name: 'ventura',
  setup: (_, setupData) => ({
    ...setupData,
    isStarted: false,
    pointCards: generateCards(5),
    actionCards: generateActionCards(6),
    actionGems: Array(6).fill(0),
    coins: [5, 7],
    gems: [40, 30, 20, 10],
    players: [],
  }),
  turn: {
    minMoves: 1,
    maxMoves: 1,
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
      // TODO: handle duplicate action cards
      G.actionCards.push(randomizeActionCard())

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
      G.pointCards.push(randomizePointCard())
      // TODO: handle duplicate point cards
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
        // TODO: validate
        for (let i = 0; i < times; i++) {
          G.players[playerID].gems = [
            player.gems[0] + card.exchange[1][0] - card.exchange[0][0],
            player.gems[1] + card.exchange[1][1] - card.exchange[0][1],
            player.gems[2] + card.exchange[1][2] - card.exchange[0][2],
            player.gems[3] + card.exchange[1][3] - card.exchange[0][3],
          ]
        }
      } else if (card.upgrade) {
        // TODO: validate
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
}
