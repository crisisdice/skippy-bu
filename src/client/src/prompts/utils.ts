import {
  PileKey,
  Source,
} from 'skip-models'

import {
  g
} from '../i8n'

export const mapPiles = (piles: PileKey[]) => {
  return piles.map(pile => {
    return {
      name: parseInt(pile.slice(-1)).toString(),
      value: pile
    }
  })
}

export const mapCardSource = (source: Source, card: number, key?: PileKey) => {
  let sourceString

  switch(source) {
    case Source.HAND:
      sourceString = g.hand
      break
    case Source.DISCARD:
      sourceString = g.discard
      break
    case Source.STOCK:
      sourceString = g.stock
      break
  }

  return {
    name: `${card === 99 ? 'S' : card.toString()} (${sourceString})`,
    value: {
      source,
      key: key ?? null,
      card,
    }
  }
}
