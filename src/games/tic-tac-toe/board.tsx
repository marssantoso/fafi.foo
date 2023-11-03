import React from 'react'
import { BoardProps } from 'boardgame.io/react'

export function TicTacToeBoard({ ctx, G, moves }: BoardProps) {
  const onClick = (id: number) => moves.clickCell(id)

  let winner: React.JSX.Element = <></>
  if (ctx.gameover) {
    winner = <div id="winner">{ctx.gameover.winner === undefined ? 'Draw!' : `Winner: ${ctx.gameover.winner}`}</div>
  }

  const cellStyle: React.CSSProperties = {
    border: '1px solid #555',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
  }

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

  return (
    <div>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {winner}
    </div>
  )
}
