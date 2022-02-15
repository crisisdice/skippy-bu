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

  async createGame(): Promise<GameStateView> {
    try {
      return (await this.client.post<GameStateView>('games')).data
    } catch (e) {
      throw e
    }
  }
  
  async joinGame(key: string): Promise<GameStateView> {
    try {
      return (await this.client.put<GameStateView>('games', { key })).data
    } catch (e) {
      throw e
    }
  }
  
  async fetchGame(key: string): Promise<GameStateView> {
    try {
      return (await this.client.get<GameStateView>('games', { params: { key } })).data
    } catch (e) {
      throw e
    }
  }
  
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
    ws.on('open', () => {
      ws.send(
        JSON.stringify({
          token: this.token,
          key,
          action,
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

