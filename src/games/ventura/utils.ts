import { ActionCard, PointCard, Gems } from './types'
import { PRICE_WEIGHT_MAP, ACTION_TYPES } from './constants'

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const getRandomGems = (point: number): Gems => {
  for (;;) {
    const a = getRandomInt(0, 5);
    const b = getRandomInt(0, 5);
    const c = getRandomInt(0, 4);
    const d = getRandomInt(0, 4);

    const totalGem = a + b + c + d
    const totalWeight = [a, b, c, d].reduce((a, b, i) => a + b * PRICE_WEIGHT_MAP[i], 0)
    if (totalGem <= 10 && totalWeight === point) {
      return [a, b, c, d];
    }
  }
}

export const randomizePointCard = (): PointCard => {
  const point = getRandomInt(6, 20)
  const price = getRandomGems(point)
  return { point, price }
}

export const randomizeActionCard = (): ActionCard => {
  const actionType = ACTION_TYPES[getRandomInt(0, 2)]

  if (actionType === 'gain') {
    return { gain: getRandomGems(getRandomInt(4, 8)) }
  }

  if (actionType === 'upgrade') {
    return { upgrade: getRandomInt(1, 3) }
  }

  const from = getRandomInt(getRandomInt(2, 4), getRandomInt(6, 8))
  const to = getRandomInt(from, getRandomInt(from, from + 14))
  return { exchange: [getRandomGems(from), getRandomGems(to)] }
}

export const generateCards = (n: number): PointCard[] => {
  const cards: PointCard[] = []
  while (cards.length < n) {
    const card = randomizePointCard()
    if (cards.every((c) => c.price.join('') !== card.price.join(''))) {
      cards.push(card)
    }
  }
  return cards
}

export const generateActionCards = (n: number): ActionCard[] => {
  const cards: ActionCard[] = []
  while (cards.length < n) {
    const card = randomizeActionCard()
    if (cards.every((c) => JSON.stringify(c) !== JSON.stringify(card))) {
      cards.push(card)
    }
  }
  return cards
}

export const getInitialGemsByPlayerId = (id: number): Gems => {
  const a = Math.floor((id + 1) / 2) % 2 + 3
  const b = Math.floor((id + 1) / 4)

  // TODO: figure out c and d for when id is really high
  return [a, b, 0, 0]
}
