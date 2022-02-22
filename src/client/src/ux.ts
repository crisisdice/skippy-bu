import {
  PlayerKey,
  GameStateView,
  Action,
  Move as IMove,
  MoveType as Move,
  PileKey,
  Source,
} from 'skip-models'
import { g } from './i8n'
import {
  AnnotatedCard,
  ListQuestion,
} from './types'
import {
  filterPlayableCards,
} from './utils'

export const configureUx = (
  listQuestion: ListQuestion,
  handQuestion: (question: string) => Promise<number>,
  discardQuestion: (question: string) => Promise<PileKey>,
  cardQuestion: (question: string) => Promise<{ card: number, source: Source }>,
  playQuestion: (question: string) => Promise<PileKey>,
  render: (state: GameStateView) => void,
) => {
  const discard = async (): Promise<IMove | null> => {
    const card = await handQuestion(g.chooseDiscard)
    const target = await discardQuestion(g.choosePile)
    return { type: Move.DISCARD, card, target }
  }
  const play = async (): Promise<IMove> => {
    const { card, source } = await cardQuestion(g.choosePlay)
    const target = await playQuestion(g.choosePile)
    return { type: Move.PLAY, source, card, target }
  }
  const turn = async (state: GameStateView, commit: (args: IMove) => void) => {
    const player = state.players[state.yourKey]
    if (player === null || !player.hand) throw new Error('Corrupt state')
    const playableCards = filterPlayableCards(player, state)

    while (true) {
      render(state)
      const action = !playableCards.length
        ? Move.DISCARD
        : (
            await listQuestion(g.actionPrompt, [
              { name: g.play, value: Move.PLAY },
              { name: g.discardAndEnd, value: Move.DISCARD },
            ])
          )
      const move = await (
        action === Move.PLAY
          ? play()
          : discard()
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

