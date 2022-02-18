import {
  GameState,
  Players,
  PlayerKey,
} from '../types'

function getDeck(): number[] {
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

function deal(gameState: GameState, playerKey: PlayerKey): GameState {
  const player = gameState.players[playerKey]
  if (!player) return gameState

  player.stock = gameState.deck.splice(0, 10)

  return gameState
}

export function shuffleDealAndDraw(gameState: GameState): GameState {
  gameState.deck = shuffle(getDeck())

  gameState = deal(gameState, Players.One)
  gameState = deal(gameState, Players.Two)
  gameState = deal(gameState, Players.Three)
  gameState = deal(gameState, Players.Four)
  gameState = deal(gameState, Players.Five)
  gameState = deal(gameState, Players.Six)

  gameState = draw(gameState, Players.One)
  gameState = draw(gameState, Players.Two)
  gameState = draw(gameState, Players.Three)
  gameState = draw(gameState, Players.Four)
  gameState = draw(gameState, Players.Five)
  gameState = draw(gameState, Players.Six)

  return gameState
}

