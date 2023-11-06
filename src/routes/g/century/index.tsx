import { Client } from 'boardgame.io/react'
import { Century } from '~/games'
import { CenturyBoard } from '~/games/boards.ts'

const CenturyGame = Client({ game: Century, board: CenturyBoard })

// const CenturyGame = () => <div>
//   <CenturyBoard />
// </div>

export default CenturyGame
