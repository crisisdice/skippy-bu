//TODO share routes between client, logic, and crud
//TODO upgrade directly to ws

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
  Move,
  Player,
  draw,
  Source,
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
  const play = setUpPlay(endpoint + '/games')

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
      console.log(data.toString())
      const { game, user, move } = await guard(data.toString())

      const group = move.action === Action.CREATE
        ? createGroup(ws, game, user)
        : connections.get(game.key)

      if (!group) throw new Error('Group not found')

      switch (move.action) {
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
          discard(game, move)
          break
        case Action.PLAY:
          play(game, move)
          break
      }
      await broadcast(group, game)
    })
  })
}

function setUpWsLocals(
  endpoint: string,
  secret: string): (data: string) => Promise<{ game: Game, user: User, move: Move }> {

  const verifyUser = setUpUserVerification(endpoint + '/users/locate', secret)

  return async (data: string) => {
    try {
      const { key, token, move } = JSON.parse(data) as Message
      const { data: game } = await axios.get<Game>(endpoint + '/games/locate', {
        params: {
         key
        }
      })
      const user = await verifyUser(token)

      if (!user && !game) throw new Error('Fatal not found')
      return { game, user, move }
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

    state.activePlayer = findStartingPlayer(state)
    state.started = true
  
    try { 
      game = (await axios.put<Game>(endpoint, { state }, { params: { key: game.key } })).data
      if (game === null) throw new Error()
    } catch (e) {
      throw new Error()
    }
  }
}

function setUpDiscard(endpoint: string): (game: Game, move: Move) => Promise<void> {
  return async (game: Game, move: Move) => {
    const state = game.state
    const index = (state.players[state.activePlayer] as Player).hand.indexOf(move.card)
    const card = (state.players[state.activePlayer] as Player).hand.splice(index, 1);

    (state.players[state.activePlayer] as Player).discard[move.target] = [
      card[0], ...(state.players[state.activePlayer] as Player).discard[move.target]
    ]
    const newState = draw(state, state.activePlayer)
    newState.activePlayer = findNextPlayer(state)
  
    try { 
      game = (await axios.put<Game>(endpoint, { state }, { params: { key: game.key } })).data
      if (game === null) throw new Error()
    } catch (e) {
      throw new Error()
    }
  }
}

function setUpPlay(endpoint: string): (game: Game, move: Move) => Promise<void> {
  return async (game: Game, move: Move) => {
    let state = game.state

    let actualCard

    const { source, sourceKey, card, target } = move

    const getCardFromHand = () => {
      const index = (state.players[state.activePlayer] as Player).hand.indexOf(card)
      return (state.players[state.activePlayer] as Player).hand.splice(index, 1)[0]
    }

    const getCardFromDiscard = () => {
      if (!sourceKey) { throw new Error('') }
      return (state.players[state.activePlayer] as Player).discard[sourceKey].splice(0, 1)[0]
    }

    switch(source) {
      case Source.HAND:
        actualCard = getCardFromHand()
        break
      case Source.DISCARD:
        actualCard = getCardFromDiscard()
        break
      case Source.STOCK:
        actualCard = (state.players[state.activePlayer] as Player).stock.splice(0,1)[0]
        break
    }

    console.log('actual card' + actualCard.toString())

    state.building[target] = [ actualCard, ...state.building[target] ]

    console.log('target')
    console.log(target)

    console.log(state.building[target])

    if (state.building[target].length === 12) {
      state.discard = [ ...state.building[target], ...state.discard ]
      state.building[target] = []
    }

    if ((state.players[state.activePlayer] as Player).hand.length === 0) {
      state = draw(state, state.activePlayer)
    }

    if ((state.players[state.activePlayer] as Player).stock.length === 0) {
      state.winner = state.activePlayer
    }
  
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

function findStartingPlayer(state: GameState): PlayerKey {
  if (!state) throw new Error('')
  return 'player_2' as PlayerKey
}

