import { Game } from 'boardgame.io'
import { INVALID_MOVE } from 'boardgame.io/core'
import { ACTION_CARDS, INITIAL_PLAYER_STATE, POINT_CARDS, STARTER_ACTION_CARDS } from './constants'
import { getInitialGemsByPlayerId } from './utils'
import type { GameState } from './types'

export const Ventura: Game<GameState> = {
  name: 'ventura',
  setup: (_, setupData) => ({
    ...setupData,
    isStarted: false,
    pointCards: [...POINT_CARDS],
    actionCards: [...ACTION_CARDS],
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
      move: ({ G }, id: number) => {
        G.players[id] = { ...INITIAL_PLAYER_STATE }
      },
    },
    startGame: {
      noLimit: true,
      move: ({ G }) => {
        G.players.forEach((_p, i) => {
          G.players[i].gems = getInitialGemsByPlayerId(i)
          G.players[i].actionCards = [...STARTER_ACTION_CARDS]
        })
        G.isStarted = true
      },
    },
    takeActionCard: ({ G }, { playerId, cardId, gems }) => {
      const card = G.actionCards[cardId]
      const player = G.players[playerId]
      const totalGems = gems.reduce((prev: number, curr: number) => prev + curr, -1)
      if (!card || totalGems < cardId) return INVALID_MOVE
      G.players[playerId].actionCards = [...player.actionCards, card]
      G.players[playerId].gems = [
        player.gems[0] - gems[0],
        player.gems[1] - gems[1],
        player.gems[2] - gems[2],
        player.gems[3] - gems[3],
      ]
      G.actionCards = G.actionCards.filter((_g, i) => i !== cardId)
      // TODO: open action card from stack
    },
    buyCard: ({ G }, { playerId, cardId }) => {
      const card = G.pointCards[cardId]
      const player = G.players[playerId]
      if (card?.price.some((p, i) => p > player.gems[i])) return INVALID_MOVE
      G.players[playerId].pointCards = [...player.pointCards, card]
      G.players[playerId].gems = [
        player.gems[0] - card.price[0],
        player.gems[1] - card.price[1],
        player.gems[2] - card.price[2],
        player.gems[3] - card.price[3],
      ]
      G.pointCards = G.pointCards.filter((_g, i) => i !== cardId)
      // TODO: open card from stack
    },
    playCard: ({ G }, { playerId, cardId, times = 1, upgrade }) => {
      const player = G.players[playerId]
      const card = player.actionCards[cardId]

      if (card.gain) {
        G.players[playerId].gems = [
          player.gems[0] + card.gain[0],
          player.gems[1] + card.gain[1],
          player.gems[2] + card.gain[2],
          player.gems[3] + card.gain[3],
        ]
      } else if (card.exchange) {
        for (let i = 0; i < times; i++) {
          G.players[playerId].gems = [
            player.gems[0] + card.exchange[1][0] - card.exchange[0][0],
            player.gems[1] + card.exchange[1][1] - card.exchange[0][1],
            player.gems[2] + card.exchange[1][2] - card.exchange[0][2],
            player.gems[3] + card.exchange[1][3] - card.exchange[0][3],
          ]
        }
      } else if (card.upgrade) {
        G.players[playerId].gems = [
          player.gems[0] + upgrade[1][0] - upgrade[0][0],
          player.gems[1] + upgrade[1][1] - upgrade[0][1],
          player.gems[2] + upgrade[1][2] - upgrade[0][2],
          player.gems[3] + upgrade[1][3] - upgrade[0][3],
        ]
      }

      G.players[playerId].actionCards = player.actionCards.filter((_g, i) => i !== cardId)
      G.players[playerId].table = [...player.table, card]
    },
    rest: ({ G }, id) => {
      G.players[id].actionCards = [...G.players[id].actionCards, ...G.players[id].table]
      G.players[id].table = []
    },
  },
}
