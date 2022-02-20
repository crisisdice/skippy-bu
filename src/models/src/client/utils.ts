import {
  Source,
  PlayerView,
  GameStateView,
  whereCardCanBePlayed,
  piles,
  PileKey
} from '../shared'
import { g } from './i8n'
import { AnnotatedCard } from './types'

export function mapPiles() {
  return piles.map(pile => {
    return {
      name: parseInt(pile.slice(-1)).toString(),
      value: pile
    }
  })
}

export function annotateCard(card: number, source: Source): AnnotatedCard {
  const mapping = {
    [Source.HAND]:  g.hand,
    [Source.STOCK]: g.stock,
    [Source.PILE1]: g.discard,
    [Source.PILE2]: g.discard,
    [Source.PILE3]: g.discard,
    [Source.PILE4]: g.discard,
  }
  return {
    name: `${card === 99 ? 'S' : card.toString()} (${mapping[source]})`,
    value: {
      source,
      card
    }
  }
}

export function filterPlayableCards(player: PlayerView, state: GameStateView): AnnotatedCard[] {
  const handCards = annotateHandCards(player)
  const stockCard = annotateCard(player.stock[0], Source.STOCK)
  const discardCards = (Object.keys(player.discard) as PileKey[])
    .map(key => {
      const pile = player.discard[key]
      return pile.length
        ? annotateCard(pile[0], key as Source)
        : null
    })
    .filter((card): card is AnnotatedCard => !!card)

  const playableCardFilter = (card: AnnotatedCard): boolean => {
    return whereCardCanBePlayed(card.value.card, state).length > 0
  }
  return [ stockCard, ...handCards, ...discardCards].filter(playableCardFilter)
}

export const annotateHandCards = (player: PlayerView): AnnotatedCard[] => {
  return player.hand!.map(card => annotateCard(card, Source.HAND))
}

