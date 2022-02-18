import { PlayerKey, PileKey } from './keys'
import { Piles } from './data'

export type GameStateView = {
  name: string
  started: boolean
  winner: PlayerKey | null

  building: Piles

  yourKey: PlayerKey
  activePlayer: PlayerKey

  players: Record<PlayerKey, PlayerView | null>
}

export type PlayerView = {
  key: string
  nickname: string

  stock: number[]
  discard: PilesView 
  hand: number[]
}

export type PilesView = Record<PileKey, number | null>

