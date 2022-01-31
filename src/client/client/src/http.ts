import axios from 'axios'
import { Credentials } from 'engine'

export class LoginClient {
  private readonly client
  constructor(
    api: string,
  ) {
    const baseURL = `${api}users`
    console.log(baseURL)
    this.client = axios.create({ baseURL })
  }

  async login({ email, password }: Credentials) {
    const { data: token } = await this.client.post(`login`, {
      email,
      password
    })
    return token
  }

  async register({ email, password, nickname }: Credentials & { nickname: string }) {
    const { data: token } = await this.client.post(`register`, {
      email,
      password,
      nickname
    })
    return token
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
    const { data } = await this.client.post(`endpoints.createGame`)
    return data
  }
  
  async joinGame() {
    // TODO
  }
  
  async showGames() {
    // TODO
  }
  
  async startGame() {
    // TODO
  }
}
