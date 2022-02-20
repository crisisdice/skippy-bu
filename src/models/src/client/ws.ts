import WebSocket from 'ws'

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

import {
  printASCIIPlayerView
} from './rendering'

export const configureWs = (key: string, token: string, isCreate: boolean, listQuestion: ListQuestion) => {
  const format = (action: Action, move?: Move) => {
    return JSON.stringify({
      token,
      key,
      action,
      move
    } as Message)
  }
  const { start, turn, winner } = configureUx(listQuestion)
  const firstMessage = format(isCreate
      ? Action.CREATE
      : Action.JOIN
  )
  const update = async (ws: WebSocket, data: string): Promise<void> => {
    const state        = JSON.parse(data) as GameStateView
    const render = () => {
      console.clear()
      console.log(printASCIIPlayerView(state))
    }
    const winnerPrompt = winner(() => ws.close(), render)
    const startPrompt  = start(() => ws.send(format(Action.START)), render)
    const turnPrompt   = turn((move: Move) => ws.send(format(Action.MOVE, move)), render)

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

