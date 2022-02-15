import {
  GameStateView,
  Action
} from 'skip-models'
import WebSocket from 'ws'
import {printASCIIPlayerView} from '../rendering'


export class GameClient {
  //public stack: string[] = []
  private ws
  constructor(
    wsURL: string,
    token: string,
    key: string,
    initalAction: Action
  ) {
    const ws = new WebSocket(wsURL)
    ws.on('open', () => {
      ws.send(
        JSON.stringify({
          token,
          key,
          action: initalAction
        })
      )
    })

    ws.on('message', (data) => {
      const view = JSON.parse(data.toString()) as GameStateView
      console.clear()
      console.log(printASCIIPlayerView(view.yourKey, null, view))
    })

    this.ws = ws
  }



}
