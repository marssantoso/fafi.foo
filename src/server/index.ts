import { customAlphabet } from 'nanoid'
import { Server, Origins } from 'boardgame.io/server'
import { TicTacToe, Ventura } from '../games'

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

const server = Server({
  games: [TicTacToe, Ventura],
  origins: [Origins.LOCALHOST],
  uuid: nanoid,
  generateCredentials: () => nanoid(9),
})

server.run(8000)
