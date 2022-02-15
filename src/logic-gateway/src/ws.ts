import { verify } from 'jsonwebtoken'
import { WebSocketServer, WebSocket } from 'ws'
import axios from 'axios'
import { Message, Action, PlayerKey } from 'skip-models'
import { Game as IGame, User } from '@prisma/client'
import {
  toView,
  GameState
} from 'skip-models'
import { initializePlayer } from 'skip-models'

type Group = Map<string, { ws: WebSocket, key: PlayerKey }>
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
  const endpoint = 'http://localhost:3000/games'

  async function broadcast(key: string) {
    const group: Group = connections.get(key)
    const { data: game } = await axios.get<Game>(endpoint + '/locate', {
      params: { key }
    })
    const state = game.state

    group.forEach((v) => {
      v.ws.send(JSON.stringify(toView(state, v.key)))
    })
  }

  async function create(ws: WebSocket, game: Game, user: User) {
    const group = new Map()
    group.set(user.key, { ws, key: 'player_1' })
    connections.set(game.key, group)
  }

  async function join(ws: WebSocket, game: Game, user: User) {
    const state = game.state
    let slot: PlayerKey = 'player_1'
    for (const player of Object.keys(state.players)) {
      if (state.players[player as PlayerKey] === null) {
        slot = player as PlayerKey
        break
      }
    }
    if (!slot) throw new Error('Game is full')

    state.players[slot] = initializePlayer(user)

    await axios.put<Game>(endpoint, { state }, { params: { key: game.key } })

    const group: Group = connections.get(game.key)
    group.set(user.key, { ws, key: slot })
  }

  function start() {}
  function play() {}
  function discard() {}

  wss.on('connection', async (ws) => {
    ws.on('message', async (data) => {
      const { game, user, action } = await guard(data.toString())



      switch (action) {
        case Action.CREATE:
          create(ws, game, user)
          break
        case Action.JOIN:
          join(ws, game, user)
          break
        case Action.START:
        case Action.PLAY:
        case Action.DISCARD:
        default:
          throw new Error('not implemented')
      }
      await broadcast(game.key)
    })
  })
}

async function guard(data: string) {
  const params = JSON.parse(data) as Message
  const { key, token, action } = params
  const decoded = verify(token, 'secret') as Token
  const endpoint = 'http://localhost:3000/games'
  const { data: game } = await axios.get<Game>(endpoint + '/locate', {
    params: {
      key
    }
  })

  const { data: user } = await axios.get('http://localhost:3000/users/locate', {
    params: {
      key: decoded.key
    }
  })

  if (!user && !game) throw new Error('Fatal not found')
  return { game, user, action }
}

