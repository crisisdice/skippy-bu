import {
  GameState,
  PlayerKey,
} from '../types'

function getDeck(): number[] {
  // TODO get actual card amounts
  const length = 10
  const skipboSymbol = 99
  const cards = Array.from(Array(11).keys()).flatMap((card) => {
    return Array(length).fill(card + 1)
  })
  return [ ...cards, ...Array(length).fill(skipboSymbol)]
}

function shuffle(deck: number[]): number[] {
  const getRandomIndex = (len: number) => {
    return Math.floor(Math.random() * len)
  }
  return Array.from(Array(deck.length).keys()).reverse().flatMap((len) => {
    return deck.splice(getRandomIndex(len), 1)
  })
}

function deal(gameState: GameState, playerKey: PlayerKey): GameState {
  const player = gameState.players[playerKey]
  if (!player) return gameState

  player.stock = gameState.deck.splice(0, 10)

  return gameState
}

export function draw(gameState: GameState, playerKey: PlayerKey): GameState {
  const player = gameState.players[playerKey]
  if (!player) return gameState
  const cardsToDraw = 5 - player.hand.length

  if (gameState.deck.length < cardsToDraw) {
    gameState.deck = shuffle([ ...gameState.deck, ...gameState.discard ])
  }

  const cards = gameState.deck.splice(0, cardsToDraw)

  player.hand = [ ...player.hand, ...cards ]
  
  return gameState
}

export function shuffleDealAndDraw(gameState: GameState): GameState {
  gameState.deck = shuffle(getDeck())

  gameState = deal(gameState, PlayerKey.One)
  gameState = deal(gameState, PlayerKey.Two)
  gameState = deal(gameState, PlayerKey.Three)
  gameState = deal(gameState, PlayerKey.Four)
  gameState = deal(gameState, PlayerKey.Five)
  gameState = deal(gameState, PlayerKey.Six)

  gameState = draw(gameState, PlayerKey.One)
  gameState = draw(gameState, PlayerKey.Two)
  gameState = draw(gameState, PlayerKey.Three)
  gameState = draw(gameState, PlayerKey.Four)
  gameState = draw(gameState, PlayerKey.Five)
  gameState = draw(gameState, PlayerKey.Six)

  return gameState
}
