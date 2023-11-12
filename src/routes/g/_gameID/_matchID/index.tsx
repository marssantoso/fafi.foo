import { useState, useEffect } from 'react'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'
import { LobbyClient } from 'boardgame.io/client'
import localForage from 'localforage'
import { useParams } from 'react-router-dom'
import { TicTacToe, Ventura } from '~/games'
import { TicTacToeBoard, VenturaBoard } from '~/games/boards'

const { protocol, hostname, port } = window.location
const server = `${protocol}//${hostname}:${port}`

const lobbyClient = new LobbyClient({ server })

const TicTacToeClient = Client({
  game: TicTacToe,
  board: TicTacToeBoard,
  multiplayer: SocketIO({ server }),
  numPlayers: 2,
})

const VenturaClient = Client({
  game: Ventura,
  board: VenturaBoard,
  multiplayer: SocketIO({ server }),
  numPlayers: 2,
})

const GameMatch = () => {
  const [playerName, setPlayerName] = useState<string | null>()
  const [playerID, setPlayerID] = useState('')
  const [credentials, setCredentials] = useState<string>()
  const { gameID, matchID } = useParams()

  // get player name
  useEffect(() => {
    localForage.getItem<string>('playerName').then(setPlayerName)
  }, [])

  // get previous match
  useEffect(() => {
    if (!gameID || !matchID) return
    localForage.getItem<{ [p: string]: { playerCredentials: string; playerID: string } }>(gameID).then((v) => {
      if (!v || !v?.[matchID]) return
      const { playerID, playerCredentials } = v[matchID]
      setPlayerID(playerID)
      setCredentials(playerCredentials)
    })
  }, [gameID, matchID])

  // join game if no credentials
  useEffect(() => {
    if (!gameID || !matchID || !playerName || credentials) return
    ;(async () => {
      const { playerCredentials, playerID } = await lobbyClient.joinMatch(gameID, matchID, { playerName })

      localForage.setItem(gameID, { [matchID]: { playerCredentials, playerID } })
      setPlayerID(playerID)
      setCredentials(playerCredentials)
    })()
  }, [gameID, matchID, playerName, credentials])

  return (
    <div>
      {gameID === 'tic-tac-toe' ? (
        <TicTacToeClient playerID={playerID} matchID={matchID} credentials={credentials} debug={true} />
      ) : gameID === 'ventura' ? (
        <VenturaClient playerID={playerID} matchID={matchID} credentials={credentials} debug={true} />
      ) : (
        ''
      )}
    </div>
  )
}

export default GameMatch
