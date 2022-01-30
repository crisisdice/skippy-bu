export * from './types'

import {
  initalizeGameState,
} from './mapping'

import {
  shuffleDealAndDraw,
} from './methods'

import {
  User
} from '@prisma/client'

export function createGameState(creator: User) {
  return shuffleDealAndDraw(initalizeGameState(creator))
}

export { toView } from './mapping'

