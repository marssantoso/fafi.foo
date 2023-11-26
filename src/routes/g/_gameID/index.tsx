import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LobbyClient } from 'boardgame.io/client'
import localForage from 'localforage'
import { usePlayerName } from '~/hooks'
import { GAMES } from '~/constants'

const { protocol, hostname, port } = window.location
const server = __BASE_URL__ || `${protocol}//${hostname}:${port}`
const lobbyClient = new LobbyClient({ server })

const GameLobby = () => {
  const [playerName, setPlayerName] = usePlayerName()
  const navigate = useNavigate()
  const { gameID } = useParams<string>()
  const [matches, setMatches] = useState<{ matchID: string }[]>([])
  const game = GAMES.find(({ id }) => id === gameID)

  useEffect(() => {
    if (!gameID) return
    lobbyClient.listMatches(gameID).then(({ matches }) => setMatches(matches))
  }, [gameID])

  const joinMatch = async (matchID: string, playerName: string) => {
    await localForage.setItem('playerName', playerName)
    navigate(`/g/${gameID}/${matchID}`)
  }

  const getPlayerName = async () => {
    if (playerName) return playerName
    const userName = prompt('Enter player name')
    await localForage.setItem('playerName', userName).then(setPlayerName)
    return userName
  }

  const onJoin = async (ID?: string) => {
    if (!gameID) return

    const playerName = await getPlayerName()
    if (!playerName) return

    const matchID = ID ?? prompt('Enter match ID')?.toUpperCase()
    if (!matchID) return

    await joinMatch(matchID, playerName)
  }

  const onCreate = async () => {
    if (!gameID) return

    const playerName = await getPlayerName()
    if (!playerName) return

    let numPlayers = 2
    if (gameID === 'ventura') {
      const ans = prompt('Enter number of players')
      if (!ans || isNaN(parseInt(ans))) return
      numPlayers = parseInt(ans)
    }
    const { matchID } = await lobbyClient.createMatch(gameID, { numPlayers })
    await joinMatch(matchID, playerName)
  }

  return (
    <div>
      <h1 className="page__title">{game ? game.name : ''}</h1>
      <div style={{ textAlign: 'center' }}>
        <button type="button" onClick={onCreate}>
          Create Room
        </button>
      </div>
      {matches.length ? (
        <div style={{ padding: 16 }}>
          <p>or join one of the rooms below:</p>
          <ul>
            {matches.map((s, i) => (
              <li key={i}>
                <span>{s.matchID} </span>
                <a href="#" onClick={() => onJoin(s.matchID)}>
                  (join)
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default GameLobby
