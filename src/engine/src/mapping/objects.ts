import {
  Piles,
  Player,
  GameState,
  PlayerKey,
  User,
} from 'skip-models'

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
    nickname: user.nickname,
    key: user.key,
    hand: [],
    stock: [],
    discard: initializePiles()
  }
}

export function initalizeGameState(creator: User): GameState {
  return {
    name: creator.nickname,
    started: false,
    winner: null,
    players: {
      player_1: initializePlayer(creator),
      player_2: null,
      player_3: null,
      player_4: null,
      player_5: null,
      player_6: null,
    },
    activePlayer: PlayerKey.One,
    deck: [],
    discard: [],
    building: initializePiles(),
  }
}
