//TODO share routes between client, logic, and crud
//TODO upgrade directly to ws

import {
  WebSocket
} from 'ws'

import axios from 'axios'

import {
  Message,
  Action,
  Game,
  User,
  routes,
} from '../shared'

import {
  transformationMapping
} from './export'

import {
  toView,
} from './mapping'

type Group = Map<string, WebSocket>
export type Connections = Map<string, Group>
type SetupArgs = { endpoint: string, verifyUser: (token: string) => Promise<User> }

export const WS = {
  CONNECTION: 'connection',
  MESSAGE: 'message',
  OPEN: 'open',
}
const locate = 'locate'

export function setupWs({ endpoint, verifyUser }: SetupArgs) {
  const buildUrl = (route: string) => `${endpoint}/${route}/${locate}`
  const guard = async (data: string) => {
    try {
      const { key, token, move } = JSON.parse(data) as Message
      const { data: game } = await axios.get<Game>(buildUrl(routes.games), {
        params: {
         key
        }
      })
      const user = await verifyUser(token)

      if (!user && !game) throw new Error('Fatal not found')
      return { game, user, move }
    } catch (e) {
      throw e
    }
  }
  const createGroup = (ws: WebSocket, connections: Connections, game: Game, user: User) => {
    const group = new Map()
    group.set(user.key, ws)
    connections.set(game.key, group)
    return group
  }

  return async (data: string, ws: WebSocket, connections: Connections) => {
    const { game, user, move } = await guard(data.toString())

    const group = move.action === Action.CREATE
      ? createGroup(ws, connections, game, user)
      : connections.get(game.key)

      if (!group) throw new Error('Group not found')

      if (move.action === Action.JOIN) group.set(user.key, ws)

      const state = transformationMapping(game, user, move)[move.action]()

      let updated: Game
      try { 
        updated = (
          await axios.put<Game>(`${endpoint}/${routes.games}`, {
            state
          }, {
            params: { key: game.key }
          })
        ).data
        if (updated === null) throw new Error('Error updating game state')
      } catch (e) {
        throw e
      }
      group.forEach((socket: WebSocket, key: string) => {
        socket.send(JSON.stringify(toView(game.state, key)))
      })
  }
}

