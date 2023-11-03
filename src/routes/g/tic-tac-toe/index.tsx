import { FormEvent, useState } from 'react'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'
import { LobbyClient } from 'boardgame.io/client'
import { TicTacToe } from '../../../games'
import { TicTacToeBoard } from '../../../games/tic-tac-toe/board.tsx'

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' })

const TicTacToeClient = Client({
  game: TicTacToe,
  board: TicTacToeBoard,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
  numPlayers: 2,
})

const Game = () => {
  // const [matches, setMatches] = useState<unknown[]>([])
  const [matchID, setMatchID] = useState('')
  const [playerID, setPlayerID] = useState('')
  const [credentials, setCredentials] = useState<string>()

  /*useEffect(() => {
    lobbyClient.listMatches('tic-tac-toe').then(({ matches }) => setMatches(matches))
  }, [])*/

  const joinMatch = async (matchID: string, playerName: string) => {
    const { playerCredentials, playerID } = await lobbyClient.joinMatch('tic-tac-toe', matchID, { playerName })

    setMatchID(matchID)
    setPlayerID(playerID)
    setCredentials(playerCredentials)
  }

  const onSubmitJoin = async (e: FormEvent) => {
    e.preventDefault()
    const matchID = ((e.target as HTMLFormElement)[0] as HTMLInputElement).value
    const playerName = ((e.target as HTMLFormElement)[1] as HTMLInputElement).value
    await joinMatch(matchID, playerName)
  }

  const onSubmitCreate = async (e: FormEvent) => {
    e.preventDefault()
    const playerName = ((e.target as HTMLFormElement)[0] as HTMLInputElement).value
    const { matchID } = await lobbyClient.createMatch('tic-tac-toe', { numPlayers: 2 })
    await joinMatch(matchID, playerName)
  }

  return playerID ? (
    <div>
      <p>MatchID: {matchID}</p>
      <TicTacToeClient playerID={playerID} matchID={matchID} credentials={credentials} debug={true} />
    </div>
  ) : (
    <div>
      <h2>Create Room</h2>
      <form onSubmit={onSubmitCreate}>
        <input type="text" placeholder="Enter username" />
        <button type="submit">Create</button>
      </form>
      <h2>Join Room</h2>
      {/*<ul>
        {matches.map((s, i) => (
          <li key={i}>{JSON.stringify(s as Record<string, string>)}</li>
        ))}
      </ul>*/}
      <form onSubmit={onSubmitJoin}>
        <input type="text" placeholder="Enter roomID" />
        <input type="text" placeholder="Enter username" />
        <button type="submit">Join</button>
      </form>
    </div>
  )
}

export default Game
