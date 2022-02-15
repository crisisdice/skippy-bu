export * from './types'
export * from './mapping'

import {
  initalizeGameState,
} from './mapping'

import {
  shuffleDealAndDraw,
} from './methods'

import {
  User
} from '@prisma/client'

export function createGameState(creator: User, key: string) {
  return shuffleDealAndDraw(initalizeGameState(creator, key))
}
