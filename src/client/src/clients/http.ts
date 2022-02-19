import axios from 'axios'
import {
  Login,
  Register,
  CreateGame,
  FetchGames,
  Game,
} from '../types'

export const authorizationClient = (baseURL: string) => {
  const client = axios.create({ baseURL })
  const login: Login = async ({ email, password }) => {
    try {
      const { data: token } = await client.put('/', {
        email,
        password
      })
      return token
    } catch (e) {
      console.error(JSON.stringify(e))
      return null
    }
  }
  const register: Register = async ({ email, password, nickname }) => {
    try {
      const { data: token } = await client.post('/', {
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
  return { login, register }
}

export const lobbyClient = (baseURL: string, token: string) => {
  const client = axios.create({ baseURL, headers: { 'Authorization': `Bearer ${token}` } })
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

