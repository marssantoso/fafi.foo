import { useState, useEffect } from 'react'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'
import { LobbyClient } from 'boardgame.io/client'
import localForage from 'localforage'
import { useParams } from 'react-router-dom'
import { TicTacToe } from '~/games'
import { TicTacToeBoard } from '~/games/boards'

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' })

const TicTacToeClient = Client({
  game: TicTacToe,
  board: TicTacToeBoard,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
  numPlayers: 2,
})

const TicTacToeMatch = () => {
  const [playerName, setPlayerName] = useState<string | null>()
  const [playerID, setPlayerID] = useState('')
  const [credentials, setCredentials] = useState<string>()
  const { matchID } = useParams()

  // get player name
  useEffect(() => {
    localForage.getItem<string>('playerName').then(setPlayerName)
  }, [])

  // get previous match
  useEffect(() => {
    if (!matchID) return
    localForage.getItem<{ [p: string]: { playerCredentials: string, playerID: string } }>('tic-tac-toe').then((v) => {
      if (!v || !v?.[matchID]) return
      const { playerID, playerCredentials } = v[matchID]
      setPlayerID(playerID)
      setCredentials(playerCredentials)
    })
  }, [matchID])

  // join game if no credentials
  useEffect(() => {
    if (!matchID || !playerName || credentials) return

    ;(async () => {
      const { playerCredentials, playerID } = await lobbyClient.joinMatch('tic-tac-toe', matchID, { playerName })

      localForage.setItem('tic-tac-toe', { [matchID]: { playerCredentials, playerID } })
      setPlayerID(playerID)
      setCredentials(playerCredentials)
    })()
  }, [matchID, playerName, credentials])

  return (
    <div>
      <TicTacToeClient playerID={playerID} matchID={matchID} credentials={credentials} debug={true} />
    </div>
  )
}

export default TicTacToeMatch
