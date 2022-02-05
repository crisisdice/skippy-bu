import { User } from '@prisma/client'

import {
  Piles,
  Player,
  GameState,
} from '../types'

function initializePiles(): Piles {
  return {
    pile_1: [],
    pile_2: [],
    pile_3: [],
    pile_4: [],
  }
}

export function initializePlayer(user: User): Player {
  return {
    user,
    hand: [],
    stock: [],
    discard: initializePiles()
  }
}

export function initalizeGameState(creator: User, key: string): GameState {
  return {
    key,
    deck: [],
    discard: [],
    building: initializePiles(),
    activePlayer: null,
    players: {
      player_1: initializePlayer(creator),
      player_2: null,
      player_3: null,
      player_4: null,
      player_5: null,
      player_6: null,
    }
  }
}

