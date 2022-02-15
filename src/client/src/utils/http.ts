import axios from 'axios'

import {
  Credentials,
  GameStateView,
} from 'skip-models'

const handleFrontendError = (e: any): null => {
  console.error('Error')
  console.error(JSON.stringify(e))
  return null
//
//      console.log(this.b)
//      console.log(JSON.stringify(this.client))
//      throw e
}

export class LoginClient {
  private readonly client
  constructor(
    api: string,
  ) {
    const baseURL = `${api}/users`
    this.client = axios.create({ baseURL })
    if(!this.client) throw new Error('Axios fail')
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
      return handleFrontendError(e)
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
      return handleFrontendError(e)
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

  async createGame(): Promise<GameStateView | null> {
    try {
      return (await this.client.post<GameStateView>('games')).data
    } catch (e) {
      return handleFrontendError(e)
    }
  }
  
  async joinGame(key: string): Promise<GameStateView | null> {
    try {
      return (await this.client.put<GameStateView>('games', { key })).data
    } catch (e) {
      return handleFrontendError(e)
    }
  }
  
  async fetchGame(key: string): Promise<GameStateView | null> {
    try {
      return (await this.client.get<GameStateView>('games', { params: { key } })).data
    } catch (e) {
      return handleFrontendError(e)
    }
  }
  
  async fetchGames(): Promise<GameStateView[]> {
    try {
      return (await this.client.get<GameStateView[]>('games/all')).data
    } catch (e) {
      return handleFrontendError(e) ?? []
    }
  }
  
  async startGame() {
    // TODO
    //ws.on('open', function open() {
    //  ws.send('something');
    //});
    //
    //ws.on('message', function message(data) {
    //  console.log('received: %s', data);
    //});
  }
}

