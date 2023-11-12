import { Link, useOutlet } from 'react-router-dom'
import Header from '~/components/Header'
import { GAMES } from '~/constants'

const Games = () => {
  const Outlet = useOutlet()
  return (
    <div>
      <Header />
      <main>
        {Outlet || (
          <>
            <h1 className="page__title">Games</h1>
            <ul>
              {GAMES.map(({ id, name }) => (
                <li key={id}>
                  <Link to={`/g/${id}`}>{name}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Games
