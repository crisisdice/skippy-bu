import WebSocket from 'ws'

import {
  Action,
  GameStateView,
} from 'skip-models'

import {
  printASCIIPlayerView
} from '../rendering'

import {
  listQuestion
} from '../elements'

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

  private formatSend(action: Action) {
    return JSON.stringify({
      token: this.token,
      key: this.key,
      action,
    })
  }

  private initializesWs(url: string, initialMessage: string) {
    const ws = new WebSocket(url)
      
    ws.on('open', () => {
      ws.send(initialMessage)
    })
  
    ws.on('message', (data: string) => {
      this.handel(data)
    })
  
    return ws
  }

  private async handel(data: any) {
    const state = JSON.parse(data.toString()) as GameStateView
    console.clear()
    console.log(printASCIIPlayerView(state))

    const isCreator = state.player.key === state.players.player_1?.key
    const started = state.activePlayer !== null
    const moreThanTwoPlayers = state.players.player_2 !== null

    const yourTurn = state.activePlayer
      ? state.players[state.activePlayer]?.key === state.player.key
      : false

    if (moreThanTwoPlayers && isCreator && !started) {
      const start = await listQuestion('start?', [
        { name: 'start', value: Action.START },
      ])

      if (start === Action.START) {
        this.send(Action.START)
      }
    }

    if (yourTurn && started) {
      const start = await listQuestion('end turn?', [
        { name: 'end', value: Action.DISCARD },
      ])

      if (start === Action.DISCARD) {
        this.send(Action.DISCARD)
      }
    }
  }
}

