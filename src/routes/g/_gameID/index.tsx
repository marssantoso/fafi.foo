import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LobbyClient } from 'boardgame.io/client'
import localForage from 'localforage'
import { usePlayerName } from '~/hooks/usePlayerName.ts'

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' })

const GameLobby = () => {
  const [playerName] = usePlayerName()
  const navigate = useNavigate()
  const { gameID } = useParams<string>()
  const [matches, setMatches] = useState<{ matchID: string }[]>([])

  useEffect(() => {
    if (!gameID) return
    lobbyClient.listMatches(gameID).then(({ matches }) => setMatches(matches))
  }, [gameID])

  const joinMatch = async (matchID: string, playerName: string) => {
    await localForage.setItem('playerName', playerName)
    navigate(`/g/${gameID}/${matchID}`)
  }

  const onJoin = async (ID?: string) => {
    if (!playerName || !gameID) return
    const matchID = ID ?? prompt('Enter room ID')?.toUpperCase()
    if (!matchID) return
    await joinMatch(matchID, playerName)
  }

  const onCreate = async () => {
    if (!playerName || !gameID) return
    const { matchID } = await lobbyClient.createMatch(gameID, { numPlayers: 2 })
    await joinMatch(matchID, playerName)
  }

  return (
    <div>
      <ul>
        {matches.map((s, i) => (
          // <li key={i}>{JSON.stringify(s as Record<string, string>)}</li>
          <li key={i}>
            <span>{s.matchID} </span>
            <a href="#" onClick={() => onJoin(s.matchID)}>(join)</a>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onCreate}>
        Create Room
      </button>
      <button type="button" onClick={() => onJoin()}>
        Join Room
      </button>
    </div>
  )
}

export default GameLobby
