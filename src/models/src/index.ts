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

import { GameState } from './types'

export type Game = Omit<IGame, 'state'> & { state: GameState }

export type User = IUser

export type GameCreateInput = Prisma.GameCreateInput

export enum Action {
  CREATE,
  JOIN,
  START,
  PLAY,
  DISCARD,
}

export enum Source {
  HAND,
  STOCK,
  DISCARD,
}

export type Message = {
  token: string // for auth and to get user
  key: string   // to find game
  action: Action
}

export type Move = {
  source: Source
  card: number
}
