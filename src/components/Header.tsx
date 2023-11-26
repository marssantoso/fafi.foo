import localForage from 'localforage'
import { usePlayerName } from '~/hooks'
import styles from './header.module.css'
import { Link } from 'react-router-dom'

const Header = () => {
  const [playerName, setPlayerName] = usePlayerName()

  const onEnterName = () => {
    const newName = prompt('Enter player name')
    if (!newName) return
    localForage.setItem('playerName', newName).then(setPlayerName)
  }

  return (
    <div className={styles.header}>
      <Link to="/" className={styles.brand}>
        <img src="/fafi.foo.svg" alt="fafi.foo" width={64} height={64} className={styles.logo} />
        <span>fafi.foo</span>
      </Link>
      <div className={styles.user}>
        {playerName ? (
          <>
            <p className={styles.user__name}>
              Playing as: <strong>{playerName}</strong>
            </p>
            <a onClick={onEnterName} className={styles.user__link}>
              [edit]
            </a>
          </>
        ) : (
          <a onClick={onEnterName} className={styles.user__link}>
            [enter player name]
          </a>
        )}
      </div>
    </div>
  )
}

export default Header
