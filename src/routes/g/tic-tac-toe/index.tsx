import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LobbyClient } from 'boardgame.io/client'
import localForage from 'localforage'

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' })

const TicTacToeLobby = () => {
  const navigate = useNavigate()
  // const [matches, setMatches] = useState<unknown[]>([])

  /*useEffect(() => {
    lobbyClient.listMatches('tic-tac-toe').then(({ matches }) => setMatches(matches))
  }, [])*/

  const joinMatch = async (matchID: string, playerName: string) => {
    await localForage.setItem('playerName', playerName)
    navigate(`/g/tic-tac-toe/${matchID}`)
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

  return (
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

export default TicTacToeLobby
