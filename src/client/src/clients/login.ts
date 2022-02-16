import axios from 'axios'

import {
  Credentials,
} from 'skip-models'

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
      const { data: token } = await this.client.post('/login', {
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
      const { data: token } = await this.client.post('/register', {
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

