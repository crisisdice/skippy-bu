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
    name: user.nickname,
    key: user.key,
    hand: [],
    stock: [],
    discard: initializePiles()
  }
}

export function initalizeGameState(creator: User): GameState {
  return {
    // metadata
    name: creator.nickname,
    // players
    players: {
      player_1: initializePlayer(creator),
      player_2: null,
      player_3: null,
      player_4: null,
      player_5: null,
      player_6: null,
    },
    activePlayer: null,
    // field
    deck: [],
    discard: [],
    building: initializePiles(),
  }
}

