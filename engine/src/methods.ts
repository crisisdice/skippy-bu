import {
  GameState,
  Player,
  PlayerKey,
} from "./types"

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

function moveTo(card: number | undefined, target: number[]): number[] {
  return !!card ? [ ...target, card ] : target
}

function draw(gameState: GameState, playerKey: PlayerKey): GameState {
  const currentHand = (gameState[playerKey as keyof GameState] as Player).hand
  let cardsNeeded = 5 - currentHand.length
  while (cardsNeeded > 0) {
    gameState = drawOne(gameState, playerKey)
    cardsNeeded--
  }
  return gameState
}

function drawOne(gameState: GameState, playerKey: PlayerKey): GameState {
  const player = (gameState[playerKey as keyof GameState] as Player)
  const card = gameState.deck.pop()
  player.hand = moveTo(card, player.hand)
  return gameState
}

export function shuffleAndDraw(gameState: GameState): GameState {
  const shuffledDeck = shuffle(getDeck())
  
  gameState.deck = shuffledDeck

  gameState = draw(gameState, 'player_1')
  gameState = draw(gameState, 'player_2')

  return gameState
}

//console.log(getDeck())
//console.log(shuffle(getDeck()))
//  deck layout
//  bottom -> [ 1 , .... ] <- top
//


