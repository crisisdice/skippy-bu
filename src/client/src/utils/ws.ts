import WebSocket from 'ws'

export class GameClient {
  public stack: string[] = []
  private readonly gameKey
  constructor(
    wsURL: string,
    token: string,
    key: string,
  ) {
    const ws = new WebSocket(wsURL)
    this.gameKey = key


    ws.on('open', () => {
      ws.send(
        JSON.stringify({
          token,
          key
        })
      )
    })

    ws.on('message', (data) => {
      console.log('message: %s', data) 
      //this.stack.push(data.toString())
    })
  }

  public key() { return this.gameKey }
}
