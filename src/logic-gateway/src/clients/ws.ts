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
  PlayerKey,
  initializePlayer,
  GameState,
  shuffleDealAndDraw,
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
  const join = setUpJoin(endpoint + '/games')
  const start = setUpStart(endpoint + '/games')
  const discard = setUpDiscard(endpoint + '/games')

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
          join(user, game)
          group.set(user.key, ws)
          break
        case Action.START:
          start(game)
          break
        case Action.DISCARD:
          discard(game)
          break
        case Action.PLAY:
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
      const { key, token, action } = JSON.parse(data) as Message
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

function setUpJoin(endpoint: string): (user: User, game: Game) => Promise<void> {
  return async (user: User, game: Game) => {
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
  
    try { 
      game = (await axios.put<Game>(endpoint, { state }, { params: { key: game.key } })).data
      if (game === null) throw new Error()
    } catch (e) {
      throw new Error()
    }
  }
}

function setUpStart(endpoint: string): (game: Game) => Promise<void> {
  return async (game: Game) => {
    const state = shuffleDealAndDraw(game.state)

    const player = game.state.players.player_2

    if (player === null) throw new Error('should not be null')

    state.activePlayer = 'player_2'
  
    try { 
      game = (await axios.put<Game>(endpoint, { state }, { params: { key: game.key } })).data
      if (game === null) throw new Error()
    } catch (e) {
      throw new Error()
    }
  }
}

function setUpDiscard(endpoint: string): (game: Game) => Promise<void> {
  return async (game: Game) => {
    const state = game.state

    // TODO discard card

    state.activePlayer = findNextPlayer(state)
  
    try { 
      game = (await axios.put<Game>(endpoint, { state }, { params: { key: game.key } })).data
      if (game === null) throw new Error()
    } catch (e) {
      throw new Error()
    }
  }
}

function findNextPlayer(state: GameState): PlayerKey {
  const activePlayer = state.activePlayer

  if (activePlayer === null) throw new Error('No active player')

  const players = Object.keys(state.players).filter(key => 
    state.players[key as PlayerKey] !== null
  )
  return (activePlayer === players[players.length - 1]
    ? players[0]
    : players[players.indexOf(activePlayer) + 1]) as PlayerKey
}

