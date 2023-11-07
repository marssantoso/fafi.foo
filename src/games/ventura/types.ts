export type Gems = [number, number, number, number]

export type ActionType = 'gain' | 'exchange' | 'upgrade'

export interface PointCard {
  point: number
  price: Gems
}

export interface ActionCard {
  gain?: Gems
  exchange?: [Gems, Gems]
  upgrade?: number
}

export interface State {
  pointCards: PointCard[]
  actionCards: ActionCard[]
  gems: Gems
  coins: [number, number]
}

export interface PlayerState extends State {
  used: ActionCard[]
  name?: string
  isActive?: boolean
}

export interface GameState extends State {
  isStarted: boolean
  players: PlayerState[]
}
