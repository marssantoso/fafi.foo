import type { ActionCard, Card, Gems } from './types'
import { generateActionCards, generateCards } from './utils'

export const PRICE_WEIGHT_MAP: Gems = [2, 3, 4, 5]

export const ACTION_TYPES: Array<'gain' | 'exchange' | 'upgrade'> = ['gain', 'exchange', 'upgrade']

export const CARDS: Card[] = generateCards(10)

export const ACTION_CARDS: ActionCard[] = generateActionCards(20)

export const STARTER_ACTION_CARDS: [ActionCard, ActionCard] = [{ gain: [2, 0, 0, 0] }, { upgrade: 2 }]
