import { ActionCard, Card, Gems } from './types.ts'
import { PRICE_WEIGHT_MAP, ACTION_TYPES } from './constants'

const totalGemPoint = (gems: Gems) => gems.reduce((a, b, j) => a + b * PRICE_WEIGHT_MAP[j], 0)

// result sum must be <= 10
// result total point must be <= point
// point must be 6 - 20
const randomizeGems = (point: number): Gems =>
  PRICE_WEIGHT_MAP.reduce(
    (p, w, i) => {
      const currGems: Gems = [...p]
      const currentSum = currGems.reduce((a, b) => a + b)
      const currentTotal = totalGemPoint(currGems)
      const remainingMax = Math.min(10 - currentSum, Math.floor((point - currentTotal) / w))
      currGems[i] = Math.round(Math.random() * remainingMax)
      return currGems
    },
    [0, 0, 0, 0]
  )

export const randomizeCard = (): Card => {
  const price = randomizeGems(Math.floor(Math.random() * 13) + 8)
  const point = totalGemPoint(price)
  return { point, price }
}

export const randomizeActionCard = (): ActionCard => {
  const actionType = ACTION_TYPES[Math.floor(Math.random() * 3)]
  if (actionType === 'gain') {
    return { gain: randomizeGems(6) }
  }
  if (actionType === 'upgrade') return { upgrade: Math.round(Math.random() * 2) + 1 }
  const from = Math.round(Math.random() * 6) + Math.round(Math.random() * 4)
  return { exchange: [randomizeGems(from), randomizeGems(from + Math.round(Math.random() * 4))] }
}
