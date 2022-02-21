import hash from 'object-hash'
import {
  PlayerKey,
  whereCardCanBePlayed,
  GameStateView,
  Action,
  Move as IMove,
  MoveType as Move,
} from 'skip-models'
import { g } from './i8n'
import {
  AnnotatedCard,
  ListQuestion,
  Option,
} from './types'
import {
  mapPiles,
  filterPlayableCards,
  annotateHandCards,
} from './utils'

export const configureUx = (
  listQuestion: ListQuestion,
  render: (state: GameStateView) => void,
) => {
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
      ? Move.DISCARD
      : (
          await listQuestion(g.actionPrompt, [
            { name: g.play, value: Move.PLAY },
            { name: g.discardAndEnd, value: Move.DISCARD },
          ])
        )
  }
  const discard = async (state: GameStateView, noPlayableCards: boolean): Promise<IMove | null> => {
    const player = state.players[state.yourKey]
    if (player === null || !player.hand) throw new Error('Corrupt state')
    const hand = annotateHandCards(player)
    const pilesQuestion = genericPrompt(g.choosePile, mapPiles())
    const cardQuestion = genericPrompt(g.chooseDiscard, hand)
    while (true) {
      render(state)
      const response = await (noPlayableCards
        ? listQuestion(g.chooseDiscard, hand)
        : cardQuestion()
      )
      if (!response) break
      const { card } = response
      const target = await pilesQuestion()
      if (!target) continue
      return { type: Move.DISCARD, card, target }
    }
    return null
  }
  const play = async (state: GameStateView, playableCards: AnnotatedCard[]): Promise<IMove | null> => {
    const cardQuestion = genericPrompt(g.choosePlay, playableCards)
    while (true) {
      render(state)
      const response = await cardQuestion()
      if (!response) break
      const { source, card } = response
      const targets = whereCardCanBePlayed(card, state)
      const pilesQuestion = genericPrompt(g.choosePile, mapPiles(targets)) 
      const target = targets.length === 1
          ? targets[0]
          : await pilesQuestion()
      if (!target) continue
      return { type: Move.PLAY, source, card, target }
    }
    return null
  }
  const turn = async (state: GameStateView, commit: (args: IMove) => void) => {
    const player = state.players[state.yourKey]
    if (player === null || !player.hand) throw new Error('Corrupt state')
    const playableCards = filterPlayableCards(player, state)

    while (true) {
      render(state)
      const action = await actionPrompt(playableCards)
      const move = await (
        action === Move.PLAY
          ? play(state, playableCards)
          : discard(state, !playableCards.length)
      )
      if (!move) continue

      commit(move)
      render(state)
      return
    }
  }
  const start = async (state: GameStateView, deal: () => void) => {
    const isCreator = state.yourKey === PlayerKey.One
    const moreThanTwoPlayers = state.players.player_2 !== null
    console.log(render)
    render(state)
    if (isCreator && moreThanTwoPlayers) {
      await listQuestion(g.start, [
        { name: g.ok, value: Action.START },
      ])
      deal()
    }
  }
  const winner = async (state: GameStateView, end: () => void) => {
    render(state)
    console.log(state.winner === state.yourKey
      ? g.won
      : g.lost
    )
    end()
  }
  return { start, turn, winner }
}

