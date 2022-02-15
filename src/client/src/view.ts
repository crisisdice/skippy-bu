export type PlayerKey = 'player_1' | 'player_2' | 'player_3' | 'player_4' | 'player_5' | 'player_6'
export type PileKey = 'pile_1' | 'pile_2' | 'pile_3' | 'pile_4'

export enum Players {
  One = 'player_1',
  Two = 'player_2',
  Three = 'player_3',
  Four = 'player_4',
  Five = 'player_5',
  Six = 'player_6',
}

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

export type Credentials = {
  email: string
  password: string
}

