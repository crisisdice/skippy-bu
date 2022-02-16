import axios from 'axios'

import {
  Credentials,
  routes,
} from 'skip-models'

export class LoginClient {
  private readonly client
  constructor(
    api: string,
  ) {
    const baseURL = `${api}/${routes.users}`
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
      const { data: token } = await this.client.put('/', {
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
      const { data: token } = await this.client.post('/', {
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

