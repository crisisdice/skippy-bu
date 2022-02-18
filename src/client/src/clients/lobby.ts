import axios from 'axios'

import {
  routes,
  Game,
} from 'skip-models'

export class LobbyClient {
  private readonly client
  constructor(
    baseURL: string,
    token: string,
  ) {
    this.client = axios.create({
      baseURL: `${baseURL}/${routes.games}`,
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }

  async createGame(): Promise<string> {
    try {
      const { data: game } = await this.client.post<Game>('/')
      return game.key
    } catch (e) {
      throw e
    }
  }

  async fetchGames(): Promise<{ name: string, value: string}[]> {
    try {
      const { data: games } = await this.client.get<Game[]>('/')

      return games.map(game => {
        return {
          name: game.state.name,
          value: game.key,
        }
      })

    } catch (e) {
      console.error(JSON.stringify(e))
      return []
    }
  }
}

