import WebSocket from 'ws'

import {
  GameStateView,
  Message,
  Action,
} from '../shared'

import {
  MoveArgs,
  ListQuestion,
} from './types'

import {
  configureUx
} from './ux'

import {
  printASCIIPlayerView
} from './rendering'

export const configureWs = (key: string, token: string, isCreate: boolean, listQuestion: ListQuestion) => {
  const format = ({ action, source, card, target, sourceKey }: MoveArgs) => {
    return JSON.stringify({
      token,
      key,
      move: {
        action,
        source,
        sourceKey,
        card,
        target,
      }
    } as Message)
  }
  const { start, turn, winner } = configureUx(listQuestion)
  const render = (state: GameStateView) => {
    console.clear()
    console.log(printASCIIPlayerView(state))
  }
  const firstMessage = format({
    action: isCreate
      ? Action.CREATE
      : Action.JOIN
  })
  const update = async (ws: WebSocket, data: string): Promise<void> => {
    const winnerPrompt = winner(() => ws.close())
    const startPrompt  = start(() => ws.send(format({ action: Action.START })))
    const turnPrompt   = turn((args: MoveArgs) => ws.send(format(args)))
    const state        = JSON.parse(data) as GameStateView

    render(state)

    if (!state.started) return await startPrompt(state)
    if (state.winner) return winnerPrompt(state)
    if (state.yourTurn) return await turnPrompt(state)
  }
  return { firstMessage, update }
}

//export const gameClient = ({ wsURL, firstMessage, update }: WsArgs) => {
//  const ws = new WebSocket(wsURL)
//  ws.on('open', () => ws.send(firstMessage))
//  ws.on('message', async (data: any) => update(ws, data.toString()))
//}

