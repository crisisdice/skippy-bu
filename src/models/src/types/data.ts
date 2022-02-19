import {
  PlayerKey,
  PileKey
} from './keys'

export type GameState = {
  name: string
  winner: PlayerKey | null
  started: boolean
  building: Piles
  players: Record<PlayerKey, Player | null>
  activePlayer: PlayerKey
  deck: number[]
  discard: number[]
}

export type GameStateView = Omit<GameState, 'deck' | 'discard' | 'players'> & {
  yourTurn: boolean
  yourKey: PlayerKey
  players: PlayersView
}

export type PlayerView = Omit<Player, 'hand'> & {
  hand?: number[]
}

export type Player = {
  key: string
  nickname: string
  hand: number[]
  stock: number[]
  discard: Piles
}

export type PlayersView = Record<PlayerKey, PlayerView | null>

// top -> [] <- bottom
export type Piles = Record<PileKey, number[]>
