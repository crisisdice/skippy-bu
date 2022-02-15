import WebSocket from 'ws'

export class GameClient {
  private readonly ws
  private readonly gameKey
  constructor(
    wsURL: string,
    token: string,
    key: string,
  ) {
    this.ws = new WebSocket(wsURL)
    this.gameKey = key
  }

  public key() { return this.gameKey }
}
