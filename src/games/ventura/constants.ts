import type {ActionCard, Gems, ActionType, PlayerState} from './types'

export const MAX_POINT_CARD = 5

export const PRICE_WEIGHT_MAP: Gems = [2, 3, 4, 5]

export const ACTION_TYPES: Array<ActionType> = ['gain', 'exchange', 'upgrade']

export const STARTER_ACTION_CARDS: [ActionCard, ActionCard] = [{ gain: [2, 0, 0, 0] }, { upgrade: 2 }]

export const INITIAL_PLAYER_STATE: PlayerState = {
  pointCards: [],
  actionCards: [],
  actionGems: [],
  used: [],
  coins: [0, 0],
  gems: [0, 0, 0, 0],
}
