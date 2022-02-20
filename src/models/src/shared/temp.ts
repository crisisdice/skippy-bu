import {
  GameState,
  GameStateView,
  PileKey
} from '../shared'

import {
  Prisma,
  Game as IGame,
  User as IUser
} from '@prisma/client'

export const routes = {
  games: 'games',
  users: 'users',
}

export type Game = Omit<IGame, 'state'> & { state: GameState }

export type User = IUser

export type GameCreateInput = Prisma.GameCreateInput

export const enum Action {
  CREATE,
  JOIN,
  START,
  PLAY,
  DISCARD,
}

export const enum Source {
  HAND,
  STOCK,
  DISCARD,
}

export type Message = {
  token: string // for auth and to get user
  key: string   // to find game
  move: Move
}

export type Move = {
  action: Action
  source: Source
  sourceKey?: PileKey
  card: number
  target: PileKey
}

export const piles = [ 'pile_1', 'pile_2', 'pile_3', 'pile_4' ] as PileKey[]

export const whereCardCanBePlayed = (card: number | null, state: GameStateView): PileKey[] => {
  if (card === null) return []
  if (card === 99) return piles
  if (card === 1) return piles.filter(key => state.building[key].length === 0)

  return piles.filter(key => 
    (state.building[key]?.[0] === card - 1) ||
    (state.building[key]?.[0] === 99 && state.building[key]?.length === card - 1)
  )
}

