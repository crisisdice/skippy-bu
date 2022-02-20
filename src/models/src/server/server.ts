import { WebSocket } from 'ws'
import axios from 'axios'

import {
  Message,
  Action,
  Game,
  User,
  Move,
  routes,
} from '../shared'

import { transformState } from './export'
import { toView } from './mapping'

import {
  SetupArgs,
  Connections,
  locate
} from './types'

function wsGuard({ endpoint, verifyUser }: SetupArgs) {
  const buildUrl = (route: string) => `${endpoint}/${route}/${locate}`
  return async (ws: WebSocket, data: string, connections: Connections) => {
    try {
      const { key, token, action, move } = JSON.parse(data) as Message
      const { data: game } = await axios.get<Game>(buildUrl(routes.games), {
        params: {
          key
        }
      })
      const user = await verifyUser(token)

      if (!user && !game) throw new Error('Fatal not found')

      const group = action === Action.CREATE
        ? createGroup(ws, connections, game, user)
        : connections.get(game.key)

      if (!group) throw new Error('Group not found')

      if (action === Action.JOIN) group.set(user.key, ws)

      if (!testMoveValidity(game, move)) throw new Error('Invalid move')

      return { game, group, user, action, move }
    } catch (e) {
      throw e
    }
  }
}

function createGroup(ws: WebSocket, connections: Connections, game: Game, user: User) {
  const group = new Map()
  group.set(user.key, ws)
  connections.set(game.key, group)
  return group
}

function testMoveValidity(game: Game, move?: Move) {
  // TODO share routes between client, logic, and crud
  // TODO upgrade directly to ws
  // TODO log move sequences
  // TODO move validation
  return true
}

export function setupWsHandler({ endpoint, verifyUser }: SetupArgs) {
  const guard = wsGuard({ endpoint, verifyUser })
  return async (ws: WebSocket, data: string, connections: Connections) => {
    const { game, group, user, action, move } = await guard(ws, data.toString(), connections)

    const updated = (
        await axios.put<Game>(`${endpoint}/${routes.games}`, {
          state: transformState(game, user, move)[action]()
        }, {
          params: { key: game.key }
        })
      ).data

    if (updated === null) throw new Error('Error updating game state')

    group.forEach((socket: WebSocket, key: string) => {
      socket.send(JSON.stringify(toView(game.state, key)))
    })
  }
}

