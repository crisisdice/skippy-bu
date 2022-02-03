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

