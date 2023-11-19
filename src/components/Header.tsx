import localForage from 'localforage'
import { usePlayerName } from '~/hooks/usePlayerName.ts'
import styles from './header.module.css'
import {Link} from "react-router-dom";

const Header = () => {
  const [playerName, setPlayerName] = usePlayerName()

  const onEnterName = () => {
    const newName = prompt('Enter player name')
    localForage.setItem('playerName', newName).then(setPlayerName)
  }

  return (
    <div className={styles.header}>
      <Link to="/g" className={styles.brand}>fafi.foo</Link>
      {playerName ? (
        <div>
          <span>Playing as: {playerName} </span>
          <a href="#" onClick={onEnterName}>
            (edit)
          </a>
        </div>
      ) : (
        <a href="#" onClick={onEnterName}>
          enter name
        </a>
      )}
    </div>
  )
}

export default Header
