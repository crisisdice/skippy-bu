import {
  GameState,
  GameStateView,
  PileKey,
  Piles,
  PilesView,
  Player,
  PlayerKey,
  PlayerView,
} from '../types'

function viewTopCard(pile: number[]): number | null {
  return pile.length ? pile[0] : null
}

function pilesView(piles: Piles): PilesView {
  return Object.keys(piles).reduce((view, iKey) => {
    const key = iKey as PileKey
    view[key] = viewTopCard(piles[key])
    return view
  }, {} as PilesView)
}

function playerView(player: Player): PlayerView {
  return {
    key: player.key,
    discard: pilesView(player.discard),
    stock: player.stock?.[0] ?? null,
    nickname: player.name
  }
}

function mapPlayers(gs: GameState) {
  return Object.keys(gs.players).reduce((players, iKey) => {
    const key = iKey as PlayerKey
    const player = gs.players[key]
    players[key] = player === null ? null : playerView(player)
    return players
  }, {} as Record<PlayerKey, PlayerView | null>)
}

export function toView(gs: GameState, key: string): GameStateView {
  const match = Object.keys(gs.players).find((playerKey) => 
    gs.players[playerKey as PlayerKey]?.key === key
  )

  if (match === null) throw new Error('')

  const player = gs.players[match as PlayerKey]

  if (player === null) throw new Error('')

  return {
    name: gs.name,
    building: pilesView(gs.building),
    player: playerView(player),
    players: mapPlayers(gs),
    activePlayer: gs.activePlayer,
  }
}

