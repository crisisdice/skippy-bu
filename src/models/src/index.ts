export * from './types'
export * from './mapping'
export * from './methods'

import {
  Prisma,
  Game as IGame,
  User as IUser
} from '@prisma/client'

export const routes = {
  games: 'games',
  users: 'users',
}

import { GameState, GameStateView, PileKey } from './types'

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

export const whereCardCanBePlayed = (card: number | null, state: GameStateView): PileKey[] => {
  if (card === null) return []
  const keys = [ 'pile_1', 'pile_2', 'pile_3', 'pile_4' ] as PileKey[]
  if (card === 99) return keys
  if (card === 1) return keys.filter(key => state.building[key].length === 0)

  return keys.filter(key => 
    (state.building[key]?.[0] === card - 1) ||
    (state.building[key]?.[0] === 99 && state.building[key]?.length === card - 1)
  )
}

