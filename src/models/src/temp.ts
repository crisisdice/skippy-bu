import {
  GameState,
  GameStateView,
  PileKey,
} from './data'

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

export enum Source {
  HAND  = 'hand',
  STOCK = 'stock',
  PILE1 = 'pile_1',
  PILE2 = 'pile_2',
  PILE3 = 'pile_3',
  PILE4 = 'pile_4',
}
export enum Action {
  CREATE,
  JOIN,
  START,
  MOVE,
}

export enum MoveType {
  PLAY,
  DISCARD
}

export type Message = {
  token: string
  key: string
  action: Action
  move?: Move
}

export type Move = {
  type: MoveType
  card: number
  target: PileKey
  source?: Source
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

export const WS = {
  CONNECTION: 'connection',
  MESSAGE: 'message',
  OPEN: 'open',
}

export type Group = Map<string, WebSocket>
export type Connections = Map<string, Group>
export const locate = 'locate'

