import axios from 'axios'

const URL = 'http://localhost:3001'
const base = {
  users: '/users',
  games: '/games',
}
const endpoints = {
  login: `${base.users}/login`,
  createGame: `${base.games}/`,
}
// TODO figure out token headers (client/server)
// TODO endpoints constant

export async function login(email: string, password: string) {
  const { data: token } = await axios.post(`${URL}${endpoints.login}`, {
    email,
    password
  })

  return token
}

export async function register(email: string, password: string, nickname: string) {
  // TODO
}

export class SecureClient {
  private readonly client
  constructor(
    token: string,
  ) {
    this.client = axios.create({
      baseURL: URL,
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }

  async createGame() {
    const { data } = await this.client.post(endpoints.createGame)
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
