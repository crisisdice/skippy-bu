import hash from 'object-hash'

import {
  PlayerView,
  PlayerKey,
  whereCardCanBePlayed,
  GameStateView,
  PileKey,
  Action,
} from '../shared'

import {
  g,
} from './i8n'

import {
  MoveArgs,
  AnnotatedCard,
} from './types'

import {
  mapPiles,
  filterPlayableCards,
  annotateHandCards,
} from './utils'

type Discard = {
  action: Action
  card: number
  target: PileKey
}

export type ListQuestion = <T>(question: string, options: Option<T>[]) => Promise<T>
type Option<T> = { name: string, value: T }

export const configureUx = (listQuestion: ListQuestion) => {
  const genericPrompt = <T>(question: string, options: Option<T>[]) => {
    const back = { name: g.goBack, value: hash(question) as unknown as T }
    const optionsWithBack = [ ...options, back ]
    return async () => {
      const response = await listQuestion(question, optionsWithBack)
      const goBack = response === back.value
      return goBack ? null : response
    }
  }
  const actionPrompt = async (playableCards: AnnotatedCard[]) => {
    return !playableCards.length
      ? Action.DISCARD
      : (
          await listQuestion(g.actionPrompt, [
            { name: g.play, value: Action.PLAY },
            { name: g.discardAndEnd, value: Action.DISCARD },
          ])
        )
  }
  const pilesQuestion = genericPrompt(g.choosePile, mapPiles())
  const discard = async (render: () => void, player: PlayerView, noPlayableCards: boolean): Promise<Discard | null> => {
    const hand = annotateHandCards(player)
    const cardQuestion = genericPrompt(g.chooseDiscard, hand)
    while (true) {
      render()
      const response = await (noPlayableCards
        ? listQuestion(g.chooseDiscard, hand)
        : cardQuestion()
      )
      if (!response) break
      const { card } = response
      const target = await pilesQuestion()
      if (!target) continue
      return { action: Action.DISCARD, card, target }
    }
    return null
  }
  const play = async (render: () => void, state: GameStateView, playableCards: AnnotatedCard[]) => {
    const cardQuestion = genericPrompt(g.choosePlay, playableCards)
    while (true) {
      render()
      const response = await cardQuestion()
      if (!response) break
      const { source, card, key } = response
      const targets = whereCardCanBePlayed(card, state)
      const target = targets.length === 1
          ? targets[0]
          : await pilesQuestion()
      if (!target) continue
      return { action: Action.PLAY, source, card, target, sourceKey: key ?? undefined }
    }
    return null
  }
  const turn = (commit: (args: MoveArgs) => void, render: () => void) => {
    return async (state: GameStateView) => {
      const player = state.players[state.yourKey]
      if (player === null || !player.hand) throw new Error('Corrupt state')
      const playableCards = filterPlayableCards(player, state)

      while (true) {
        render()
        const action = await actionPrompt(playableCards)
        const move = await (
          action === Action.PLAY
            ? play(render, state, playableCards)
            : discard(render, player, !playableCards.length)
        )
        if (!move) continue
        return commit(move)
      }
    }
  }
  const start = (start: () => void, render: () => void) => {
    return async (state: GameStateView) => {
      const isCreator = state.yourKey === PlayerKey.One
      const moreThanTwoPlayers = state.players.player_2 !== null
      render()
      if (isCreator && moreThanTwoPlayers) {
        await listQuestion(g.start, [
          { name: g.ok, value: Action.START },
        ])
        start()
      }
    }
  }
  const winner = (end: () => void, render: () => void) => {
    return (state: GameStateView) => {
      render()
      console.log(state.winner === state.yourKey
        ? g.won
        : g.lost
      )
      end()
    }
  }
  return { start, turn, winner }
}

