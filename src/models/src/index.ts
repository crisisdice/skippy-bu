export * from './types'
export * from './mapping'

import {
  initalizeGameState,
} from './mapping'

import {
  shuffleDealAndDraw,
} from './methods'

import {
  Prisma,
  Game as IGame,
  User as IUser
} from '@prisma/client'

export function createGameState(creator: User, key: string) {
  return shuffleDealAndDraw(initalizeGameState(creator, key))
}

export const routes = {
  games: 'games',
  users: 'users',
}

import { GameState } from './types'

export type Game = Omit<IGame, 'state'> & { state: GameState }

export type Token = {
  key: string
  iat: number,
  exp: number,
  iss: string
}

export type User = IUser

export type GameCreateInput = Prisma.GameCreateInput
