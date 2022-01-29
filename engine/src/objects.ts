import {
  Piles,
  Player,
  GameState,
} from './types'

function initializePiles(): Piles {
  return {
    pile_1: [],
    pile_2: [],
    pile_3: [],
    pile_4: [],
  }
}

function initializePlayer(): Player {
  return {
    hand: [],
    piles: initializePiles()
  }
}

export function initalizeGameState(): GameState {
  // TODO numberOfPlayers: number
  return {
    deck: [],
    piles: initializePiles(),
    discard: [],
    player_1: initializePlayer(),
    player_2: initializePlayer(),
    player_3: null,
    player_4: null,
    player_5: null,
    player_6: null,
  }
}

