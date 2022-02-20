import { g } from './i8n'
import { PileKey, Source, PlayerView, GameStateView, whereCardCanBePlayed, piles } from '../shared'
import { AnnotatedCard } from './types'

export const mapPiles = () => {
  return piles.map(pile => {
    return {
      name: parseInt(pile.slice(-1)).toString(),
      value: pile
    }
  })
}

// TODO a generic implementation

export const annotateCard = (source: Source, card: number, key?: PileKey): AnnotatedCard => {
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

export function filterPlayableCards(player: PlayerView, state: GameStateView): AnnotatedCard[] {
  const handCards = annotateHandCards(player)
  const stockCard = annotateCard(Source.STOCK, player.stock[0])
  const discardCards = (Object.keys(player.discard) as PileKey[])
    .map(key => {
      const pile = player.discard[key]
      return pile.length
        ? annotateCard(Source.DISCARD, pile[0], key)
        : null
    })
    .filter((card): card is AnnotatedCard => !!card)

  const playableCardFilter = (card: AnnotatedCard): boolean => {
    return whereCardCanBePlayed(card.value.card, state).length > 0
  }
  return [ stockCard, ...handCards, ...discardCards].filter(playableCardFilter)
}

export const annotateHandCards = (player: PlayerView): AnnotatedCard[] => {
  return player.hand!.map(card => annotateCard(Source.HAND, card))
}

