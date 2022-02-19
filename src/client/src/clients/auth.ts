import axios from 'axios'

import {
  Login,
  Register,
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

