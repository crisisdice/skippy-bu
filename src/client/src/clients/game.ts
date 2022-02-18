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

export class GameClient {
  private credentials
  private ws

  constructor(
    wsURL: string,
    key: string,
    token: string,
    action: Action.CREATE | Action.JOIN,
  ) {
    this.credentials = { token, key }
    this.ws = this.initializesWs(wsURL, this.format({ action }))
  }

  private initializesWs(url: string, initialMessage: string) {
    const ws = new WebSocket(url)

    ws.on('open', () => {
      ws.send(initialMessage)
    })

    ws.on('message', async (data: string) => {
      const state = JSON.parse(data.toString()) as GameStateView
      console.clear()
      console.log(printASCIIPlayerView(state))

      if (!state.started) return await this.start(state)
      if (state.winner) return await this.winner(state)
      if (state.activePlayer === state.yourKey) return await this.turn(state)
    })

    return ws
  }

  private format({ action, source, card, target, sourceKey }: MoveArgs) {
    return JSON.stringify({
      ...this.credentials,
      move: {
        action,
        source,
        sourceKey,
        card,
        target,
      }
    } as Message)
  }

  private async winner(state: GameStateView) {
    winnerPrompt(state)
    this.ws.close()
  }

  private async start(state: GameStateView) {
    const start = await startPrompt(state)
    if (start) this.ws.send(
      this.format({
        action: Action.START 
      })
    )
  }

  private async turn(state: GameStateView) {
    this.ws.send(
      this.format(
        (await turnPrompt(state))
      )
    )
  }
}

type MoveArgs = {
  action: Action
  source?: Source
  card?: number
  target?: PileKey
  sourceKey?: PileKey
}
