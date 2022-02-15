import WebSocket from 'ws'
import {printASCIIPlayerView} from '../rendering'
import axios from 'axios'

import {
  Credentials,
  GameStateView,
  Action,
} from 'skip-models'

// TODO catch initialization errors
// TODO client error handling

export class LoginClient {
  private readonly client
  constructor(
    api: string,
  ) {
    const baseURL = `${api}/users`
    this.client = axios.create({ baseURL })
  }

  async login({
    email,
    password
  }: {
    email: string
    password: string
  }): Promise<string | null> {
    try {
      const { data: token } = await this.client.post(`login`, {
        email,
        password
      })
      return token
    } catch (e) {
      console.error(JSON.stringify(e))
      return null
    }
  }

  async register({
    email,
    password,
    nickname
  }: Credentials & {
    nickname: string
  }): Promise<string | null> {
    try {
      const { data: token } = await this.client.post(`register`, {
        email,
        password,
        nickname
      })
      return token
    } catch (e) {
      console.error(JSON.stringify(e))
      return null
    }
  }
}

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
      baseURL,
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }

  async createGame(): Promise<any> {
    try {
      const { data: game } = await this.client.post<GameStateView>('games')
      this.initializeWebSocket(game.key, Action.CREATE)
    } catch (e) {
      throw e
    }
  }
  
  async joinGame(key: string): Promise<any> {
    try {
      this.initializeWebSocket(key, Action.JOIN)
    } catch (e) {
      throw e
    }
  }
  
  //async fetchGame(key: string): Promise<GameStateView> {
  //  try {
  //    return (await this.client.get<GameStateView>('games', { params: { key } })).data
  //  } catch (e) {
  //    throw e
  //  }
  //}
  
  async fetchGames(): Promise<GameStateView[]> {
    try {
      return (await this.client.get<GameStateView[]>('games/all')).data
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

