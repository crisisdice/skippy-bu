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

// TODO catch initialization errors
// TODO client error handling

export class GameClient {
  ws: WebSocket
  private key: string
  private readonly token

  constructor(
    wsURL: string,
    key: string,
    token: string,
    action: Action.CREATE | Action.JOIN,
  ) {
    this.token = token
    this.key = key
    this.ws = this.initializesWs(wsURL, this.formatSend(action))
  }

  private send(action: Action) {
    this.ws.send(this.formatSend(action))
  }

  private sendMove(action: Action, source: Source, card: number, target: PileKey, sourceKey?: PileKey) {
    this.ws.send(this.formatSend(action, source, card, target, sourceKey))
  }

  private formatSend(action: Action, source?: Source, card?: number, target?: PileKey, sourceKey?:PileKey) {
    return JSON.stringify({
      token: this.token,
      key: this.key,
      move: {
        action,
        source,
        sourceKey,
        card,
        target,
      }
    } as Message)
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

  private async winner(state: GameStateView) {
    winnerPrompt(state)
    this.ws.close()
  }

  private async start(state: GameStateView) {
    const start = await startPrompt(state)
    if (start) this.send(Action.START)
  }

  private async turn(state: GameStateView) {
    const { action, source, target, card, sourceKey } = await turnPrompt(state)
    this.sendMove(action, source, card, target, sourceKey)
  }
}

