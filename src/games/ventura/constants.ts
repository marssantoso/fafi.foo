import type {ActionCard, PointCard, Gems, ActionType, PlayerState} from './types'
import { generateActionCards, generateCards } from './utils'

export const PRICE_WEIGHT_MAP: Gems = [2, 3, 4, 5]

export const ACTION_TYPES: Array<ActionType> = ['gain', 'exchange', 'upgrade']

export const POINT_CARDS: PointCard[] = generateCards(5)

export const ACTION_CARDS: ActionCard[] = generateActionCards(6)

export const STARTER_ACTION_CARDS: [ActionCard, ActionCard] = [{ gain: [2, 0, 0, 0] }, { upgrade: 2 }]

export const INITIAL_PLAYER_STATE: PlayerState = {
  pointCards: [],
  actionCards: [],
  used: [],
  coins: [0, 0],
  gems: [0, 0, 0, 0],
}
