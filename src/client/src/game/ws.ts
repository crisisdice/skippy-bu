
import {
  GameStateView,
  Message,
  Action,
  Move,
} from '../shared'

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
  render: (state: GameStateView) => void
) => {
  console.log(render)
  const ws = new WebSocket(wsURL)
  const format = (action: Action, move?: Move) => {
    return JSON.stringify({
      token,
      key,
      action,
      move
    } as Message)
  }
  const firstMessage = format(isCreate
      ? Action.CREATE
      : Action.JOIN
  )
  ws.onopen = () => ws.send(firstMessage)

  const { start, turn, winner } = configureUx(listQuestion, render)
  const update = async (ws: WebSocket, data: string): Promise<void> => {
    const state = JSON.parse(data) as GameStateView
    if (!state.started) return await start(state, () => ws.send(format(Action.START)))
    if (state.winner) return winner(state, () => ws.close())
    if (state.yourTurn) return await turn(state, (move: Move) => ws.send(format(Action.MOVE, move)))
    render(state)
  }
  ws.onmessage = async (data: any) => update(ws, data.data)
}

