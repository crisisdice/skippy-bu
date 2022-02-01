import axios from 'axios'
import {
  Credentials,
} from 'engine'

import { Game } from '@prisma/client'

const handleFrontendError = (e: any): null => {
  console.log('Error')
  console.log(JSON.stringify(e))
  return null
}


export class LoginClient {
  private readonly client
  constructor(
    api: string,
  ) {
    const baseURL = `${api}users`
    this.client = axios.create({ baseURL })
  }

  async login({ email, password }: { email: string, password: string }): Promise<string | null> {
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

  async register({ email, password, nickname }: Credentials & { nickname: string }): Promise<string | null> {
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

  async createGame() {
    try {
      return (await this.client.post(`games`)).data
    } catch (e) {
      return handleFrontendError(e)
    }
  }
  
  async joinGame(id: number | string): Promise<Game | null> {
    try {
      return (await this.client.put<Game>('games')).data
    } catch (e) {
      return handleFrontendError(e)
    }
  }
  
  async fetchGames(): Promise<Game[]> {
    try {
      return (await this.client.get('games')).data
    } catch (e) {
      return handleFrontendError(e) ?? []
    }
  }
  
  async startGame() {
    // TODO
  }
}
