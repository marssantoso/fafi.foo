import { Server, Origins } from 'boardgame.io/server'
import { TicTacToe } from '../games'

const server = Server({
  games: [TicTacToe],
  origins: [Origins.LOCALHOST],
})

server.run(8000)
