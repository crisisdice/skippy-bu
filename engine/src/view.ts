import {
  GameState,
  GameStateView,
  Piles,
  PilesView,
  PlayerKey,
} from './types'

function pilesView(piles: Piles): PilesView {
  return {
    pile_1: piles.pile_1?.[-1] ?? null,
    pile_2: piles.pile_2?.[-1] ?? null,
    pile_3: piles.pile_3?.[-1] ?? null,
    pile_4: piles.pile_4?.[-1] ?? null,
  }
}

export function toView(gs: GameState, mapping: Record<PlayerKey, string>): GameStateView {
  return {
    piles: pilesView(gs.piles),
    player_1: !!gs.player_1 ? { piles: pilesView(gs.player_1.piles), name: mapping['player_1'] } : null, 
    player_2: !!gs.player_2 ? { piles: pilesView(gs.player_2.piles), name: mapping['player_2'] } : null,
    player_3: !!gs.player_3 ? { piles: pilesView(gs.player_3.piles), name: mapping['player_3'] } : null,
    player_4: !!gs.player_4 ? { piles: pilesView(gs.player_4.piles), name: mapping['player_4'] } : null,
    player_5: !!gs.player_5 ? { piles: pilesView(gs.player_5.piles), name: mapping['player_5'] } : null,
    player_6: !!gs.player_6 ? { piles: pilesView(gs.player_6.piles), name: mapping['player_6'] } : null,
  }
}
