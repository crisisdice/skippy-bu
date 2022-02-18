import { PlayerKey, PileKey, HandKey } from './keys'

// top -> [] <- bottom
export type GameState = {
  deck: number[]
  discard: number[]
  building: Piles
  players: Record<PlayerKey, Player | null>
  activePlayer: PlayerKey | null
  name: string
}

export type Player = {
  key: string
  name: string
  hand: number[]
  stock: number[]
  discard: Piles
}

export type Piles = Record<PileKey, number[]>
export type Hand = Record<HandKey, number | null>

