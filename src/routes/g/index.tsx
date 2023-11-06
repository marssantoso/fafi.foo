import { Link, useOutlet } from 'react-router-dom'
import Header from '~/components/Header'

const Games = () => {
  const Outlet = useOutlet()
  return (
    <div>
      <div>
        <Header />
        {Outlet ? <Link to="/g">Back to list</Link> : ''}
      </div>
      <main>
        {Outlet || (
          <>
            <h1>List of Games</h1>
            <ul>
              <li>
                <a href="/g/tic-tac-toe">Tic Tac Toe</a>
              </li>
              <li>
                <a href="/g/century">Century</a>
              </li>
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Games
