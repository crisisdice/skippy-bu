import {
  Action,
  GameStateView,
  PlayerView,
  PileKey,
  Source,
  whereCardCanBePlayed,
} from 'skip-models'

import {
  listQuestion
} from '../elements'

import {
  mapCardSource,
  mapPiles
} from './utils'

export function winnerPrompt(state: GameStateView) {
  const isWinner = state.winner === state.yourKey

  const text = isWinner
    ? 'congratulations!'
    : 'better luck next time!'
  console.log(text)
}

export async function startPrompt(state: GameStateView): Promise<boolean> {
  const isCreator = state.yourKey === 'player_1'
  const moreThanTwoPlayers = state.players.player_2 !== null

  if (!moreThanTwoPlayers) return false
  if (!isCreator) return false
  
  await listQuestion('start?', [
    { name: 'start', value: Action.START },
  ])

  return true
}

function playableCards(player: PlayerView, state: GameStateView) {
  const playableCardFilter = (card: number): boolean => {
    return whereCardCanBePlayed(card, state).length > 0
  }

  const handCards = player.hand
    .filter(playableCardFilter)
    .map(card => mapCardSource(Source.HAND, card))

  const discardCards = Object.keys(player.discard)
    .filter(key => {
      const card = player.discard[key as PileKey]
      return card !== null && playableCardFilter(card)
    })
    .map(key => {
      const card = player.discard[key as PileKey] as number
      return mapCardSource(Source.DISCARD, card, key as PileKey)
    })

  const stockCard = playableCardFilter(player.stock?.[0])
    ? [mapCardSource(Source.STOCK, player.stock?.[0])]
    : []
  
  const noPlayableCards = !handCards.length && !discardCards.length && !stockCard.length

  return { noPlayableCards, handCards, discardCards, stockCard }
}

export async function turnPrompt(state: GameStateView) {
  const player = state.players[state.yourKey]
  
  if (player === null) throw new Error('Player not found')

  const { noPlayableCards, handCards, discardCards, stockCard } = playableCards(player, state)

  const action = noPlayableCards
    ? Action.DISCARD
    : (
        await listQuestion('What do you want to do?', [
          { name: 'Play a card', value: Action.PLAY },
          { name: 'Discard a card and end turn', value: Action.DISCARD },
        ])
      )

  if (action === Action.DISCARD) {
    const handCards = player.hand.map(card => mapCardSource(Source.HAND, card))
    const card = (await listQuestion('Choose a card to discard', handCards)).card
    const target = await listQuestion('Choose a pile', mapPiles(Object.keys(player.discard) as PileKey[]))

    return { action, source: Source.HAND, card, target }
  }

  if (action === Action.PLAY) {
    const cards = [ ...stockCard, ...handCards, ...discardCards ]

    const { source, card, key } = await listQuestion('Choose a card to play', cards)

    const targets = whereCardCanBePlayed(card, state)

    const target = targets.length === 1
      ? targets[0]
      : await listQuestion('Choose a pile', mapPiles(targets))

    return { action, source, card, target, sourceKey: key }
  }

  throw new Error('wrong action')
}

