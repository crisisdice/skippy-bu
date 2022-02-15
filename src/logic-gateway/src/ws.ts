import { verify } from 'jsonwebtoken'
import { WebSocketServer, WebSocket } from 'ws'
import axios from 'axios'
import { Message, Action, PlayerKey } from 'skip-models'
import { Game as IGame } from '@prisma/client'
import {
  toView,
  GameState
} from 'skip-models'

type Group = Map<string, WebSocket>
type Game = Omit<IGame, 'state'> & { state: GameState }

export type Token = {
  key: string
  iat: number,
  exp: number,
  iss: string
}

export function configureServer() {
  const wss = new WebSocketServer({ port: 3002 })
  const connections = new Map()

  async function broadcast(key: string) {
    const group: Group = connections.get(key)
    const { data: game } = await axios.get<Game>('http://localhost:3000/games/locate', {
      params: { key }
    })
    const state = game.state

    group.forEach((ws) => {
      ws.send(JSON.stringify(toView(state, 'player_1')))
    })
  }

  function create(ws: WebSocket, gameKey: string, userKey: string) {
    if (connections.has(gameKey)) throw new Error('Game already exists')
    const group = new Map()
    group.set(userKey, ws)
    connections.set(gameKey, group)
  }

  function join(ws: WebSocket, gameKey: string, userKey: string) {
    const group: Group = connections.get(gameKey)
    group.set(userKey, ws)
  }

  function start() {}
  function play() {}
  function discard() {}

  wss.on('connection', async (ws) => {
    ws.on('message', async (data) => {
      const { gameKey, userKey, action } = await guard(data.toString())

      switch (action) {
        case Action.CREATE:
          create(ws, gameKey, userKey)
          break
        case Action.JOIN:
          join(ws, gameKey, userKey)
          break
        case Action.START:
        case Action.PLAY:
        case Action.DISCARD:
        default:
          throw new Error('not implemented')
      }
      await broadcast(gameKey)
    })
  })
}

async function guard(data: string) {
  const params = JSON.parse(data) as Message
  const { key, token, action } = params
  const decoded = verify(token, 'secret') as Token

  const { data: user } = await axios.get('http://localhost:3000/users/locate', {
    params: {
      key: decoded.key
    }
  })

  if (!user) throw new Error('User not found')

  return { gameKey: key, userKey: user.key, action }
}
