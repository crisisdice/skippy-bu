import {
  PlayerKey,
  PileKey
} from './keys'

// top -> [] <- bottom
export type GameState = {
  name: string
  started: boolean
  deck: number[]
  discard: number[]
  building: Piles
  players: Record<PlayerKey, Player | null>
  activePlayer: PlayerKey
  winner: PlayerKey | null
}

export type Player = {
  key: string
  name: string
  hand: number[]
  stock: number[]
  discard: Piles
}

export type Piles = Record<PileKey, number[]>

