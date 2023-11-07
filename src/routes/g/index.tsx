import { useOutlet } from 'react-router-dom'
import Header from '~/components/Header'

const Games = () => {
  const Outlet = useOutlet()
  return (
    <div>
      <Header />
      <main>
        {Outlet || (
          <>
            <h1>List of Games</h1>
            <ul>
              <li>
                <a href="/g/_gameID">Tic Tac Toe</a>
              </li>
              <li>
                <a href="/g/ventura">Ventura Unlimited</a>
              </li>
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Games
