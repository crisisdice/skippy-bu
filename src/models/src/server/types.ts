import { User } from '../shared'
export type Group = Map<string, WebSocket>
export type Connections = Map<string, Group>
export type SetupArgs = { endpoint: string, verifyUser: (token: string) => Promise<User> }

export const WS = {
  CONNECTION: 'connection',
  MESSAGE: 'message',
  OPEN: 'open',
}
export const locate = 'locate'

