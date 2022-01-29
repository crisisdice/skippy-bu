import {
  GameState,
  GameStateView,
  Piles,
  PilesView,
} from './types'

function pilesView(piles: Piles): PilesView {
  return {
    pile_1: piles.pile_1?.[-1] ?? null,
    pile_2: piles.pile_2?.[-1] ?? null,
    pile_3: piles.pile_3?.[-1] ?? null,
    pile_4: piles.pile_4?.[-1] ?? null,
  }
}

export function toView(gs: GameState): GameStateView {
  return {
    piles: pilesView(gs.piles),
    player_1: pilesView(gs.player_1.piles),
    player_2: pilesView(gs.player_2.piles),
    player_3: !!gs.player_3 ? pilesView(gs.player_3.piles) : null,
    player_4: !!gs.player_4 ? pilesView(gs.player_4.piles) : null,
    player_5: !!gs.player_5 ? pilesView(gs.player_5.piles) : null,
    player_6: !!gs.player_6 ? pilesView(gs.player_6.piles) : null,
  }
}
