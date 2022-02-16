import WebSocket from 'ws'

import axios from 'axios'

import {
  GameStateView,
  Action,
} from 'skip-models'

import {
  printASCIIPlayerView
} from '../rendering'


// TODO catch initialization errors
// TODO client error handling
//
export class SecureClient {
  private ws: WebSocket | null = null

  private readonly client
  private readonly wsURL
  private readonly token
  constructor(
    baseURL: string,
    wsURL: string,
    token: string,
  ) {
    this.wsURL = wsURL
    this.token = token

    this.client = axios.create({
      baseURL: `${baseURL}/games`,
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }

  async createGame(): Promise<void> {
    try {
      const { data: game } = await this.client.post<GameStateView>('/')
      this.initializeWebSocket(game.key, Action.CREATE)
    } catch (e) {
      throw e
    }
  }
  
  async joinGame(key: string): Promise<void> {
    try {
      this.initializeWebSocket(key, Action.JOIN)
    } catch (e) {
      throw e
    }
  }
  
  async fetchGames(): Promise<{ name: string, value: string}[]> {
    try {
      const { data: games } = await this.client.get<GameStateView[]>('/all')

      return games.map(game => {
        return {
          name: game.players.player_1?.nickname ?? 'error fetching nickname',
          value: game.key
        }
      })

    } catch (e) {
      console.error(JSON.stringify(e))
      return []
    }
  }
  
  async startGame() {
    // TODO
  }

  private initializeWebSocket(key: string, action: Action) {
    const ws = new WebSocket(this.wsURL)

    const send = (action: Action) => {
      ws.send(
        JSON.stringify({
          token: this.token,
          key,
          action,
        })
      )
    }

    ws.on('open', () => send(action))
    ws.on('message', (data) => handel(data))
    this.ws = ws
  }
}

function handel(data: any) {
  const view = JSON.parse(data.toString()) as GameStateView
  console.clear()
  console.log(printASCIIPlayerView(view.yourKey, null, view))
}

