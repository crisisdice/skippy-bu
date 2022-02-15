import { PlayerKey, PileKey } from './keys'

export type GameStateView = {
  yourKey: PlayerKey
  key: string
  building: PilesView
  players: Record<PlayerKey, PlayerView | null>
}

export type PlayerView = {
  stock: number
  discard: PilesView 
  turn: boolean
  nickname: string
}

export type PilesView = Record<PileKey, number | null>

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
