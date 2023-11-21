import { useEffect, useState } from 'react'
import { Link, useOutlet, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Header from '~/components/Header'
import { GAMES } from '~/constants'

const Games = () => {
  const Outlet = useOutlet()
  const params = useParams()
  const [title, setTitle] = useState('fafi.foo')

  useEffect(() => {
    const game = params.gameID ? GAMES.find(({ id }) => id === params.gameID) : undefined
    setTitle(game ? `${game.name} – fafi.foo` : 'fafi.foo')
  }, [params])

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
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
