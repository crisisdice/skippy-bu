import { PlayerKey, PileKey } from './keys'
import { Prisma } from '@prisma/client'

export type GameStateView = {
  building: PilesView
  players: Record<PlayerKey, PlayerView | null>
}

export type PlayerView = {
  metadata: Prisma.JsonValue
  stock: number
  discard: PilesView 
  turn: boolean
}

export type PilesView = Record<PileKey, number | null>

