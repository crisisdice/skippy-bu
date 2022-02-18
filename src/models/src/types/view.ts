import { PlayerKey, PileKey } from './keys'

export type GameStateView = {
  name: string

  building: PilesView

  player: PlayerView
  players: Record<PlayerKey, Omit<PlayerView, 'hand'> | null>
  activePlayer: PlayerKey | null
}

export type PlayerView = {
  key: string
  nickname: string

  stock: number
  discard: PilesView 
  hand: number[]
}

export type PilesView = Record<PileKey, number | null>

