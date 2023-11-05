import { useNavigate } from 'react-router-dom'
import { LobbyClient } from 'boardgame.io/client'
import localForage from 'localforage'
import { usePlayerName } from '~/hooks/usePlayerName.ts'

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' })

const TicTacToeLobby = () => {
  const [playerName] = usePlayerName()
  const navigate = useNavigate()
  // const [matches, setMatches] = useState<unknown[]>([])

  /*useEffect(() => {
    lobbyClient.listMatches('tic-tac-toe').then(({ matches }) => setMatches(matches))
  }, [])*/

  const joinMatch = async (matchID: string, playerName: string) => {
    await localForage.setItem('playerName', playerName)
    navigate(`/g/tic-tac-toe/${matchID}`)
  }

  const onJoin = async () => {
    if (!playerName) return
    const matchID = prompt('Enter room ID')?.toUpperCase()
    if (!matchID) return
    await joinMatch(matchID, playerName)
  }

  const onCreate = async () => {
    console.log(playerName)
    if (!playerName) return
    const { matchID } = await lobbyClient.createMatch('tic-tac-toe', { numPlayers: 2 })
    await joinMatch(matchID, playerName)
  }

  return (
    <div>
      {/*<ul>
        {matches.map((s, i) => (
          <li key={i}>{JSON.stringify(s as Record<string, string>)}</li>
        ))}
      </ul>*/}
      <button type="button" onClick={onCreate}>
        Create Room
      </button>
      <button type="button" onClick={onJoin}>
        Join Room
      </button>
    </div>
  )
}

export default TicTacToeLobby
