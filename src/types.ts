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

export type PlayerKey = Omit<keyof GameState, 'deck' | 'discard' | 'piles'>

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
  player_1: PilesView
  player_2: PilesView
  player_3: PilesView | null
  player_4: PilesView | null
  player_5: PilesView | null
  player_6: PilesView | null
}

export type PilesView = {
  pile_1: number | null
  pile_2: number | null
  pile_3: number | null
  pile_4: number | null
}

