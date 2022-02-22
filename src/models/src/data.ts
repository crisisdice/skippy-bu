export type PileKey = 'pile_1' | 'pile_2' | 'pile_3' | 'pile_4'

export enum PlayerKey {
  One = 'player_1',
  Two = 'player_2',
  Three = 'player_3',
  Four = 'player_4',
  Five = 'player_5',
  Six = 'player_6',
}

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
