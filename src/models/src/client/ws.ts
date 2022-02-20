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
  const firstMessage = format({
    action: isCreate
      ? Action.CREATE
      : Action.JOIN
  })
  const update = async (ws: WebSocket, data: string): Promise<void> => {
    const state        = JSON.parse(data) as GameStateView
    const render = () => {
      console.clear()
      console.log(printASCIIPlayerView(state))
    }
    const winnerPrompt = winner(() => ws.close(), render)
    const startPrompt  = start(() => ws.send(format({ action: Action.START })), render)
    const turnPrompt   = turn((args: MoveArgs) => ws.send(format(args)), render)

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

