import { g } from './i8n'
import { PileKey, Source, } from '../shared'
import { AnnotatedCard } from './types'

export const mapPiles = (piles: PileKey[]) => {
  return piles.map(pile => {
    return {
      name: parseInt(pile.slice(-1)).toString(),
      value: pile
    }
  })
}

// TODO a generic implementation

export const mapCardSource = (source: Source, card: number, key?: PileKey): AnnotatedCard => {
  const mapping = {
    [Source.HAND]: g.hand,
    [Source.DISCARD]: g.discard,
    [Source.STOCK]: g.stock,
  }

  return {
    name: `${card === 99 ? 'S' : card.toString()} (${mapping[source]})`,
    value: {
      source,
      key,
      card,
    }
  }
}

