import React from 'react'
import { BoardProps } from 'boardgame.io/react'

export function TicTacToeBoard(props: BoardProps) {
  const { ctx, G, moves, matchData, isActive } = props
  const onClick = (id: number) => moves.clickCell(id)
  const onStarGame = () => moves.startGame()
  const isConnected = matchData?.every((e) => e.isConnected)

  const cellStyle: React.CSSProperties = {
    border: '1px solid #555',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
  }

  const boardStyle: React.CSSProperties = {
    display: 'flex'
  }

  const playersStyle: React.CSSProperties = {
    width: 150,
  }

  const players = matchData?.map(({ id, name }) => {
    return <li key={id}>{!ctx.gameover && id.toString() === ctx.currentPlayer ? '-> ' : ''}{name}{ !id ? ' (host)' : ''}</li>
  })

  const winner = matchData?.find(({ id }) => id.toString() === ctx.gameover?.winner)

  const bottomText = ctx.gameover
    ? winner === undefined
      ? 'Draw!'
      : `Winner: ${winner.name}`
    : isActive
    ? 'Your turn'
    : "Waiting for other player's turn"

  const tbody = []
  for (let i = 0; i < 3; i++) {
    const cells = []
    for (let j = 0; j < 3; j++) {
      const id = 3 * i + j
      cells.push(
        <td key={id}>
          {G.cells[id] ? (
            <div style={cellStyle}>{G.cells[id]}</div>
          ) : (
            <button style={cellStyle} onClick={() => onClick(id)} />
          )}
        </td>
      )
    }
    tbody.push(<tr key={i}>{cells}</tr>)
  }

  return isConnected ? (
    G.isStarted ? (
      <div style={boardStyle}>
        <ul style={playersStyle}>{players}</ul>
        <div>
          <table id="board">
            <tbody>{tbody}</tbody>
          </table>
          <div id="bottomText">{bottomText}</div>
        </div>
      </div>
    ) : (
      <button onClick={onStarGame}>Start Game</button>
    )
  ) : (
    <p>Waiting for all players to connect...</p>
  )
}
