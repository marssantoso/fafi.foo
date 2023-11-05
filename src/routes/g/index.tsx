import { Outlet } from 'react-router-dom'
import Header from '~/components/Header'

const Games = () => {

  return (
    <div>
      <Header />
      <h1>List of Games</h1>
      <ul>
        <li>
          <a href="/g/tic-tac-toe">Tic Tac Toe</a>
        </li>
      </ul>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Games
