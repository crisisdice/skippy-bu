import { PlayerKey, PileKey } from './keys'

export type GameStateView = {
  building: PilesView
  players: Record<PlayerKey, PlayerView | null>
}

export type PlayerView = {
  metadata: UserMetadata
  stock: number
  discard: PilesView 
  turn: boolean
}

export type PilesView = Record<PileKey, number | null>

export type UserMetadata = {
  email: string
  nickname: string
  password: string
}

