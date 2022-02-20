import WebSocket from 'ws'
import { Credentials } from 'skip-models'

export type NullableStringPromise = Promise<string | null>

export type CreateGame = () => NullableStringPromise
export type FetchGames = () => Promise<{ name: string, value: string }[]>

export type Game = {
  key: string,
  state: {
    name: string
  }
}

export type Login = (args: Omit<Credentials, 'nickname'>) => NullableStringPromise
export type Register = (args: Credentials) => NullableStringPromise

export type WsArgs = {
  wsURL: string
  firstMessage: string
  update: (ws: WebSocket, data: string) => Promise<void>
}

export type LobbyReturn = Promise<{ key: string, isCreate: boolean }>

