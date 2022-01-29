export type GameState = {
  deck: number[]
  discard: number[]
  piles: Piles
  player_1: Player
  player_2: Player
  player_3: Player | null
  player_4: Player | null
  player_5: Player | null
  player_6: Player | null
}

export type PlayerKey = 'player_1' | 'player_2' | 'player_3' | 'player_4' | 'player_5' | 'player_6'

export type Player = {
  hand: number[]
  piles: Piles
}

export type Piles = {
  pile_1: number[]
  pile_2: number[]
  pile_3: number[]
  pile_4: number[]
}

export type GameStateView = {
  piles: PilesView
  player_1: PlayerView
  player_2: PlayerView
  player_3: PlayerView
  player_4: PlayerView
  player_5: PlayerView
  player_6: PlayerView
}

export type PlayerView = {
  name: string,
  piles: PilesView 
} | null

export type PilesView = {
  pile_1: number | null
  pile_2: number | null
  pile_3: number | null
  pile_4: number | null
}

