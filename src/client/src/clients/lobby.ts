import axios from 'axios'

import {
  routes,
  Game,
} from 'skip-models'

import {
  CreateGame,
  FetchGames,
} from '../types'

export const lobbyClient = (baseURL: string, token: string) => {
  const client = axios.create({
      baseURL: `${baseURL}/${routes.games}`,
      headers: { 'Authorization': `Bearer ${token}` }
    })

  const create: CreateGame = async () => {
    try {
      return (await client.post<Game>('/')).data.key
    } catch (e) {
      console.error(JSON.stringify(e))
      return null
    }
  }

  const fetch: FetchGames = async () => {
    try {
      return (await client.get<Game[]>('/')).data.map(game => {
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

  return { create, fetch }
}

