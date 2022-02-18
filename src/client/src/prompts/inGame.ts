import {
  Action,
  GameStateView,
  PlayerView,
  PileKey,
  Source,
  whereCardCanBePlayed,
  PlayerKey,
} from 'skip-models'

import {
  listQuestion
} from '../elements'

import {
  t,
  g,
} from '../i8n'

import {
  mapCardSource,
  mapPiles
} from './utils'

export function winnerPrompt(state: GameStateView) {
  console.log(state.winner === state.yourKey
    ? g.won
    : g.lost
  )
}

export async function startPrompt(state: GameStateView): Promise<boolean> {
  const isCreator = state.yourKey === PlayerKey.One
  const moreThanTwoPlayers = state.players.player_2 !== null
  if (isCreator && moreThanTwoPlayers) {
    await listQuestion(g.start, [
      { name: g.ok, value: Action.START },
    ])
    return true
  }
  return false
}

function filterPlayableCards(player: PlayerView, state: GameStateView) {
  const playableCardFilter = (card: number) => whereCardCanBePlayed(card, state).length > 0
  const getCardFromPile = (key: string) => player.discard[key as PileKey]?.[0] ?? null

  const handCards = player.hand!.filter(playableCardFilter)
    .map(card => mapCardSource(Source.HAND, card))
  const discardCards = Object.keys(player.discard)
    .filter(key => playableCardFilter(getCardFromPile(key)))
    .map(key => {
      return mapCardSource(Source.DISCARD, getCardFromPile(key), key as PileKey)
    })
  const stockCard = playableCardFilter(player.stock?.[0])
    ? [mapCardSource(Source.STOCK, player.stock?.[0])]
    : []
  
  return [ ...stockCard, ...handCards, ...discardCards ]
}

export async function turnPrompt(state: GameStateView) {
  const player = state.players[state.yourKey]
  
  if (player === null) throw new Error('Player not found')

  const playableCards = filterPlayableCards(player, state)

  const action = !playableCards.length
    ? Action.DISCARD
    : (
        await listQuestion(t.actionPrompt, [
          { name: g.play, value: Action.PLAY },
          { name: g.discardAndEnd, value: Action.DISCARD },
        ])
      )

  if (action === Action.DISCARD) {
    const handCards = player.hand!.map(card => mapCardSource(Source.HAND, card))
    const card = (await listQuestion(g.chooseDiscard, handCards)).card
    const target = await listQuestion(g.choosePile, mapPiles(Object.keys(player.discard) as PileKey[]))

    return { action, source: Source.HAND, card, target }
  }

  if (action === Action.PLAY) {
    const { source, card, key } = await listQuestion(g.choosePlay, playableCards)

    const targets = whereCardCanBePlayed(card, state)

    const target = targets.length === 1
      ? targets[0]
      : await listQuestion(g.choosePile, mapPiles(targets))

    return { action, source, card, target, sourceKey: key }
  }

  throw new Error('wrong action')
}
