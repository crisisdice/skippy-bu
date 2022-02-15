import axios from 'axios'

import {
  Credentials,
  GameStateView,
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

export class SecureClient {
  private readonly client
  constructor(
    baseURL: string,
    token: string,
  ) {
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
}

