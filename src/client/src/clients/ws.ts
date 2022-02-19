import WebSocket from 'ws'

import {
  Action,
  GameStateView,
  Message,
  PileKey,
  Source,
} from 'skip-models'

import {
  printASCIIPlayerView
} from '../rendering'

import {
  winnerPrompt,
  turnPrompt,
  startPrompt,
} from '../prompts'

export const game = (wsURL: string, key: string, token: string, action: Action.CREATE | Action.JOIN) => {
  const ws = new WebSocket(wsURL)
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
  const update = async (data: string) => {
    const state = JSON.parse(data) as GameStateView
    const render = () => console.log(printASCIIPlayerView(state))
    console.clear()
    render()
    if (!state.started && await startPrompt(state)) ws.send(format({ action: Action.START }))
    if (state.winner) {
      winnerPrompt(state)
      ws.close()
    }
    if (state.activePlayer === state.yourKey && state.started) ws.send(format((await turnPrompt(state))))
  }

  ws.on('open', () => ws.send(format({ action })))
  ws.on('message', async (data: any) => update(data.toString))
}


type MoveArgs = {
  action: Action
  source?: Source
  card?: number
  target?: PileKey
  sourceKey?: PileKey
}

