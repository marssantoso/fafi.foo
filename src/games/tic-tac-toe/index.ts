import { Client } from 'boardgame.io/react'
import { TicTacToe } from './game'
import { TicTacToeBoard } from './board.tsx'

const TicTacToeClient = Client({ game: TicTacToe, board: TicTacToeBoard })

export default TicTacToeClient
