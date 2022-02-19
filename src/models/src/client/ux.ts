import {
  PlayerView,
  PlayerKey,
  whereCardCanBePlayed,
  GameStateView,
  PileKey,
  Source,
  Action,
} from '../shared'

import {
  g,
} from './i8n'

import {
  MoveArgs,
  ListQuestion,
  AnnotatedCard,
} from './types'

import {
  mapPiles,
  filterPlayableCards,
  annotateHandCards,
} from './utils'



}

export const configureUx = (listQuestion: ListQuestion) => {
  const discard = async (player: PlayerView) => {
    const handCards: AnnotatedCard[] = player.hand!.map(card => mapCardSource(Source.HAND, card))
    const card = (await listQuestion(g.chooseDiscard, handCards)).card
    const target = await listQuestion(g.choosePile, mapPiles(Object.keys(player.discard) as PileKey[]))
    return { action: Action.DISCARD, card, target }
  }
  const play = async (state: GameStateView, playableCards: AnnotatedCard[]) => {
    const { source, card, key } = await listQuestion(g.choosePlay, playableCards)
    const targets = whereCardCanBePlayed(card, state)
    const target = targets.length === 1
        ? targets[0]
        : await listQuestion(g.choosePile, mapPiles(targets))
    return { action: Action.PLAY, source, card, target, sourceKey: key ?? undefined }
  }
  const turn = (commit: (args: MoveArgs) => void) => {
    return async (state: GameStateView) => {
      const player = state.players[state.yourKey]
      if (player === null || !player.hand) throw new Error('Player not found')
      const playableCards = filterPlayableCards(player, state)
      const action = !playableCards.length
        ? Action.DISCARD
        : (
          await listQuestion(g.actionPrompt, [
            { name: g.play, value: Action.PLAY },
            { name: g.discardAndEnd, value: Action.DISCARD },
          ])
        )
      let args: MoveArgs | null = null
      if (action === Action.DISCARD) args = await discard(player)
      if (action === Action.PLAY) args = await play(state, playableCards)
      if (!args) throw new Error('wrong action')
      commit(args)
    }
  }
  const start = (start: () => void) => {
    return async (state: GameStateView) => {
      const isCreator = state.yourKey === PlayerKey.One
      const moreThanTwoPlayers = state.players.player_2 !== null
      if (isCreator && moreThanTwoPlayers) {
        await listQuestion(g.start, [
          { name: g.ok, value: Action.START },
        ])
        start()
      }
    }
  }
  const winner = (end: () => void) => {
    return (state: GameStateView) => {
      console.log(state.winner === state.yourKey
        ? g.won
        : g.lost
      )
      end()
    }
  }
  return { start, turn, winner }
}

