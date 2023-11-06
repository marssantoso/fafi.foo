import type { ActionCard, Card, Gems } from './types'
import { randomizeCard, randomizeActionCard } from './utils'

export const PRICE_WEIGHT_MAP: Gems = [2, 3, 4, 5]

export const ACTION_TYPES: Array<'gain' | 'exchange' | 'upgrade'> = ['gain', 'exchange', 'upgrade']

export const CARDS: Card[] = Array.from(Array(20)).map(randomizeCard)

export const ACTION_CARDS: ActionCard[] = Array.from(Array(30)).map(randomizeActionCard)

export const STARTER_ACTION_CARDS: [ActionCard, ActionCard] = [
  { gain: [2, 0, 0, 0] },
  { upgrade: 2 },
]
