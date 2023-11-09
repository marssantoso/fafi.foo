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
    return { gain: getRandomGems(getRandomInt(3, 9)) }
  }

  if (actionType === 'upgrade') {
    return { upgrade: getRandomInt(1, 3) }
  }

  const from = getRandomInt(3, 9)
  const to = getRandomInt(from + 1, from * 2)
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

export const gemsToPoint = (gems: Gems) => gems.reduce((a, b, i) => a + b * PRICE_WEIGHT_MAP[i], 0)

// [0, 1, 2, 3] --> [1, 2, 2, 3, 3, 3]
export const gemsToPieces = (gems: Gems, max = 10): number[] => {
  const pieces = gems.flatMap((a, i) => Array.from(Array(a)).map(() => i))
  if (!max || (max && pieces.length <= max)) return pieces
  return pieces.splice(pieces.length - 10, pieces.length)
}

// [1, 2, 2, 3, 3, 3] -> [0, 1, 2, 3]
export const piecesToGems = (pieces: number[]): Gems => {
  return pieces.reduce((prev, curr) => {
    prev[curr] += 1
    return prev
  }, [0, 0, 0, 0])
}

export const sortGems = (a: Gems, b: Gems) => {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2] || a[3] - b[3]
}

export const getAvailableUpgrade = (pieces: number[], n = 0) => {
  if (!n) return []
  const upgrades: number[][] = []
  const piecesSum = pieces.reduce((a, b) => a + b, 0)
  const back = (current: number[], index: number) => {
    const currentSum = current.reduce((a, b) => a + b, 0)
    if (currentSum <= n + piecesSum) {
      if (current.join() !== pieces.join() && !upgrades.map((v) => piecesToGems(v).join()).includes(piecesToGems(current).join())) {
        upgrades.push([...current])
      }
    }
    if (index === pieces.length) return
    for (let i = 1; i <= n; i++) {
      // increment current piece by i and move to next piece
      const next = [...current]
      next[index] = next[index] + i > 3 ? 3 : next[index] + i
      back(next, index + 1)
    }
    // skip increment and move to next piece
    back(current, index + 1)
  }
  back(pieces, 0)
  return upgrades
}
