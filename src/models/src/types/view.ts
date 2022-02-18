import { PlayerKey, PileKey } from './keys'

export type GameStateView = {
  name: string

  building: PilesView

  player: PlayerView
  players: Record<PlayerKey, PlayerView | null>
  activePlayer: PlayerKey | null
}

export type PlayerView = {
  key: string
  nickname: string

  stock: number
  discard: PilesView 
}

export type PilesView = Record<PileKey, number | null>

