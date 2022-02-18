import {
  WebSocketServer,
  WebSocket
} from 'ws'

import axios from 'axios'

import {
  Message,
  Action,
  toView,
  Game,
  User,
} from 'skip-models'

import {
  setUpUserVerification
} from './auth'

type Group = Map<string, WebSocket>
type Connections = Map<string, Group>

export function configureWsServer(endpoint: string, secret: string) {
  const wss = new WebSocketServer({ port: 3002 })
  const connections: Connections = new Map()
  const guard = setUpWsLocals(endpoint, secret)

  async function broadcast(group: Group, game: Game) {
    group.forEach((socket, key) => {
      socket.send(JSON.stringify(toView(game.state, key)))
    })
  }

  function createGroup(ws: WebSocket, game: Game, user: User) {
    const group = new Map()
    group.set(user.key, ws)
    connections.set(game.key, group)
    return group
  }

  wss.on('connection', async (ws) => {
    ws.on('message', async (data) => {
      const { game, user, action } = await guard(data.toString())

      const group = action === Action.CREATE
        ? createGroup(ws, game, user)
        : connections.get(game.key)

      if (!group) throw new Error('Group not found')

      switch (action) {
        case Action.CREATE:
          break
        case Action.JOIN:
          group.set(user.key, ws)
          break
        case Action.START:
        case Action.PLAY:
        case Action.DISCARD:
        default:
          throw new Error('not implemented')
      }
      await broadcast(group, game)
    })
  })
}

function setUpWsLocals(
  endpoint: string,
  secret: string): (data: string) => Promise<{ game: Game, user: User, action: Action }> {

  const verifyUser = setUpUserVerification(endpoint + '/users/locate', secret)

  return async (data: string) => {
    try {
      const params = JSON.parse(data) as Message
      const { key, token, action } = params
      const { data: game } = await axios.get<Game>(endpoint + '/games/locate', {
        params: {
         key
        }
      })

      const user = await verifyUser(token)

      if (!user && !game) throw new Error('Fatal not found')
      return { game, user, action }
    } catch (e) {
      console.error('error in guard')
      throw e
    }
  }
}

