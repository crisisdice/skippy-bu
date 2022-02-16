import WebSocket from 'ws'

import {
  Action,
  GameStateView,
} from 'skip-models'

import {
  printASCIIPlayerView
} from '../rendering'


// TODO catch initialization errors
// TODO client error handling

export class GameClient {
  private ws: WebSocket
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
    this.ws = initializesWs(wsURL, this.formatSend(action))
  }

  async startGame() {
    this.send(Action.START)
  }

  public send(action: Action) {
    this.ws.send(this.formatSend(action))
  }

  private formatSend(action: Action) {
    return JSON.stringify({
      token: this.token,
      key: this.key,
      action,
    })
  }
}

function handel(data: any) {
  const view = JSON.parse(data.toString()) as GameStateView
  console.clear()
  console.log(printASCIIPlayerView(view.yourKey, null, view))
}

function initializesWs(url: string, initialMessage: string) {
  const ws = new WebSocket(url)
    
  ws.on('open', () => {
    ws.send(initialMessage)
  })

  ws.on('message', (data: string) => {
    handel(data)
  })

  return ws
}

