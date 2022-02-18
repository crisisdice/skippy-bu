import {
  PileKey,
  Source,
} from 'skip-models'

// mapping utils
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
      sourceString = 'Hand'
      break
    case Source.DISCARD:
      sourceString = 'Discard'
      break
    case Source.STOCK:
      sourceString = 'Stock'
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

