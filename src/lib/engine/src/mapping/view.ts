import {
  GameState,
  GameStateView,
  PileKey,
  Piles,
  PilesView,
  Player,
  PlayerKey,
  PlayerView,
  UserMetadata,
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

function playerView(player: Player, turn: boolean): PlayerView {
  return {
    discard: pilesView(player.discard),
    stock: player.stock?.[0] ?? null,
    turn,
    metadata: player.user.metadata as UserMetadata,
  }
}

function mapPlayers(gs: GameState) {
  return Object.keys(gs.players).reduce((players, iKey) => {
    const key  = iKey as PlayerKey
    const player = gs.players[key]
    const playersTurn = gs.activePlayer === key

    players[key] = player === null ? null : playerView(player, playersTurn)

    return players
  }, {} as Record<PlayerKey, PlayerView | null>)
}

export function toView(gs: GameState): GameStateView {
  return {
    building: pilesView(gs.building),
    players: mapPlayers(gs)
  }
}

