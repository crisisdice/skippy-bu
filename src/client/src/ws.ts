
import {
  GameStateView,
  Message,
  Action,
  Move,
  PileKey,
  Source,
} from 'skip-models'

import {
  ListQuestion,
} from './types'

import {
  configureUx
} from './ux'

export const configureWs = (
  wsURL: string,
  key: string,
  token: string,
  isCreate: boolean,
  listQuestion: ListQuestion,
  handQuestion: (question: string) => Promise<number>,
  discardQuestion: (question: string) => Promise<PileKey>,
  cardQuestion: (question: string) => Promise<{ card: number, source: Source }>,
  playQuestion: (question: string) => Promise<PileKey>,
  render: (state: GameStateView) => void
) => {
  const format = (action: Action, move?: Move) => {
    return JSON.stringify({
      token,
      key,
      action,
      move
    } as Message)
  }
  const ws = new WebSocket(wsURL)
  const firstMessage = format(isCreate
      ? Action.CREATE
      : Action.JOIN
  )
  ws.onopen = () => ws.send(firstMessage)

  const { start, turn, winner } = configureUx(
    listQuestion, 
    handQuestion,
    discardQuestion,
    cardQuestion,
    playQuestion,
    render
  )
  const update = async (ws: WebSocket, data: string): Promise<void> => {
    const state = JSON.parse(data) as GameStateView
    if (!state.started) return await start(state, () => ws.send(format(Action.START)))
    if (state.winner) return winner(state, () => ws.close())
    if (state.yourTurn) return await turn(state, (move: Move) => ws.send(format(Action.MOVE, move)))
    render(state)
  }
  ws.onmessage = async (data: any) => update(ws, data.data)
}

