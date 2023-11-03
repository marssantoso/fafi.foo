import { FormEvent, useState } from 'react'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'
import { TicTacToe } from '../../../games'
import { TicTacToeBoard } from '../../../games/tic-tac-toe/board.tsx'

const TicTacToeClient = Client({
  game: TicTacToe,
  board: TicTacToeBoard,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
})

const Game = () => {
  const [playerID, setPlayerID] = useState('')
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = (((e.target as HTMLFormElement)[0] as HTMLInputElement).value)
    setPlayerID(value)
  }

  return playerID ? (
    <TicTacToeClient playerID={playerID} />
  ) : (
    <form onSubmit={onSubmit}>
      <input type="text" />
    </form>
  )
}

export default Game
