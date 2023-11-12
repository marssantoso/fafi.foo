import { customAlphabet } from 'nanoid'
import { Server, Origins } from 'boardgame.io/server'
import { TicTacToe, Ventura } from '~/games'
import serve from 'koa-static'
import path from 'path'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

const server = Server({
  games: [TicTacToe, Ventura],
  origins: [Origins.LOCALHOST],
  uuid: nanoid,
  generateCredentials: () => nanoid(9),
})

const clientPath = path.resolve(__dirname, '../client')
server.app.use(serve(clientPath))

server.run(PORT, () => {
  server.app.use(async (ctx, next) => {
    await serve(clientPath)(Object.assign(ctx, { path: 'index.html' }), next)
  })
})
