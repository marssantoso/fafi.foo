export type Gems = [number, number, number, number]

export interface Card {
  point: number
  price: Gems
}

export interface ActionCard {
  gain?: Gems
  exchange?: [Gems, Gems]
  upgrade?: number
}

export interface State {
  cards: Card[]
  actionCards: ActionCard[]
  gems: Gems
  coins: [number, number]
}

export interface PlayerState extends State {
  table: ActionCard[]
}

export interface GameState extends State {
  players: { [id: string]: PlayerState }
}
