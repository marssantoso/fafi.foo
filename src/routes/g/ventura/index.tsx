import { Client } from 'boardgame.io/react'
import { Ventura } from '~/games'
import { VenturaBoard } from '~/games/boards.ts'

const VenturaGame = Client({ game: Ventura, board: VenturaBoard })

// const VenturaGame = () => <div>
//   <VenturaBoard />
// </div>

export default VenturaGame
