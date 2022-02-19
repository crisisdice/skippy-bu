import {
  PlayerKey,
  GameState,
  Player,
  Game,
  Move,
  Source,
  User,
  Action,
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
  const slot = Object.keys(state.players).find(
    key => state.players[key as PlayerKey] === null
  )
  if (!slot) throw new Error('Game is full')
  state.players[slot as PlayerKey] = initializePlayer(user)
  return state
}

function start(game: Game): GameState {
  const state = shuffleDealAndDraw(game.state)
  const player = game.state.players.player_2
  if (player === null) throw new Error('should not be null')
  state.activePlayer = findStartingPlayer(state)
  state.started = true
  return state
}

function discard(game: Game, move: Move): GameState {
  const state = game.state
  const index = (state.players[state.activePlayer] as Player).hand.indexOf(move.card)
  const card = (state.players[state.activePlayer] as Player).hand.splice(index, 1);

  (state.players[state.activePlayer] as Player).discard[move.target] = [
    card[0], ...(state.players[state.activePlayer] as Player).discard[move.target]
  ]
  const newState = draw(state, state.activePlayer)
  newState.activePlayer = findNextPlayer(state)

  return newState
}

function play(game: Game, move: Move): GameState {
  const { source, sourceKey, card, target } = move
  let state = game.state

  const getCardFromHand = () => {
    const index = (state.players[state.activePlayer] as Player).hand.indexOf(card)
    return (state.players[state.activePlayer] as Player).hand.splice(index, 1)[0]
  }

  const getCardFromDiscard = () => {
    if (!sourceKey) { throw new Error('') }
    return (state.players[state.activePlayer] as Player).discard[sourceKey].splice(0, 1)[0]
  }

  let actualCard
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

  state.building[target] = [ actualCard, ...state.building[target] ]

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

export const transformationMapping = (game: Game, user: User, move: Move): Record<Action, () => GameState> => {
  return {
    [Action.CREATE]: () => game.state,
    [Action.JOIN]: () => join(game, user),
    [Action.START]: () => start(game),
    [Action.DISCARD]: () => discard(game, move),
    [Action.PLAY]: () => play(game, move),
  }
}

