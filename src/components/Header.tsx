import React from 'react'
import localForage from 'localforage'
import {usePlayerName} from "~/hooks/usePlayerName.ts";

const Header = () => {
  const [playerName, setPlayerName] = usePlayerName()

  const headerStyle: React.CSSProperties = {
    display: 'flex',
  }

  const onEnterName = () => {
    const newName = prompt('Enter new name')
    localForage.setItem('playerName', newName).then(setPlayerName)
  }

  return (
    <div style={headerStyle}>
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
