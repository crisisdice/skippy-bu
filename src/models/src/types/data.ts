import { User } from '@prisma/client'
import { PlayerKey, PileKey, HandKey } from './keys'

// top -> [] <- bottom
export type GameState = {
  key: string
  deck: number[]
  discard: number[]
  building: Piles
  players: Record<PlayerKey, Player | null>
  activePlayer: PlayerKey | null
}

export type Player = {
  user: User // TODO should this be a view, and should it be located here?
  //hand: Hand
  hand: number[]
  stock: number[]
  discard: Piles
}

export type Piles = Record<PileKey, number[]>
export type Hand = Record<HandKey, number | null>

export type Credentials = {
  email: string
  password: string
  nickname: string
}

