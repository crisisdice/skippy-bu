import {
  WebSocketServer,
  WebSocket
} from 'ws'

import axios from 'axios'

import {
  Message,
  Action,
  PlayerKey,
  toView,
  Game,
  User,
  initializePlayer,
} from 'skip-models'
import {verifyUser} from './auth'

type Group = Map<string, { ws: WebSocket, key: PlayerKey }>

export function configureWsServer() {
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
  const endpoint = 'http://localhost:3000'
  const { data: game } = await axios.get<Game>(endpoint + 'games/locate', {
    params: {
      key
    }
  })

  const user = await verifyUser(token, endpoint + 'users/locate')

  if (!user && !game) throw new Error('Fatal not found')
  return { game, user, action }
}

