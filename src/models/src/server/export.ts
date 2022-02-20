import {
  PlayerKey,
  GameState,
  Player,
  Game,
  Move,
  Source,
  User,
  Action,
  MoveType,
  PileKey,
} from '../shared'

import {
  initializePlayer,
} from './mapping'

import {
  shuffleDealAndDraw,
  draw,
} from './cards'

function join(game: Game, user: User): GameState {
  const state = game.state
  const slot = (Object.keys(state.players) as PlayerKey[]).find(
    key => state.players[key] === null
  )
  if (!slot) throw new Error('Game is full')
  state.players[slot] = initializePlayer(user)
  return state
}

function start(game: Game): GameState {
  const state = shuffleDealAndDraw(game.state)
  state.started = canStart(game)
  state.activePlayer = findStartingPlayer(state)
  return state
}

function execute(game: Game, move?: Move) {
  if (!move) throw new Error('Action is move but no move found')
  return move.type === MoveType.PLAY
    ? play(game, move)
    : discard(game, move)
}

function discard(game: Game, move: Move): GameState {
  const state = game.state
  const key = state.activePlayer
  const player = state.players[key] as Player
  const index = player.hand.indexOf(move.card)
  
  const card = player.hand.splice(index, 1)[0]
  player.discard[move.target] = [ card, ...player.discard[move.target] ]
  state.players[key] = player

  const newState = draw(state, state.activePlayer)
  newState.activePlayer = findNextPlayer(state)

  return newState
}

function play(game: Game, move: Move): GameState {
  const { source, card, target } = move
  let state = game.state
  const key = state.activePlayer
  const player = state.players[key] as Player
  let actualCard

  switch (source) {
    case Source.HAND:
      actualCard = player.hand.splice(player.hand.indexOf(card), 1)[0]
      break
    case Source.STOCK:
      actualCard = player.stock.splice(0,1)[0]
      break
    default:
      actualCard = player.discard[source as PileKey].splice(0, 1)[0]
  }
  state.players[key] = player
  state.building[target] = [ actualCard, ...state.building[target] ]
  if (state.building[target].length === 12) {
    state.discard = [ ...state.building[target], ...state.discard ]
    state.building[target] = []
  }
  if (player.hand.length === 0) state = draw(state, key)
  if (player.stock.length === 0) state.winner = key

  return state
}

function findNextPlayer(state: GameState): PlayerKey {
  const activePlayer = state.activePlayer
  const players = Object.keys(state.players).filter(key => 
    state.players[key as PlayerKey] !== null
  )
  return (activePlayer === players[players.length - 1]
    ? players[0]
    : players[players.indexOf(activePlayer) + 1]) as PlayerKey
}

function findStartingPlayer(state: GameState): PlayerKey {
  // TODO
  if (!state) throw new Error('')
  return PlayerKey.Two
}

function canStart(game: Game) {
  // TODO 
  const player = game.state.players.player_2
  if (player === null) throw new Error('should not be null')
  return true
}

export const transformState = (game: Game, user: User, move?: Move): Record<Action, () => GameState> => {
  return {
    [Action.CREATE]: () => game.state,
    [Action.JOIN]: () => join(game, user),
    [Action.START]: () => start(game),
    [Action.MOVE]: () => execute(game, move),
  }
}

