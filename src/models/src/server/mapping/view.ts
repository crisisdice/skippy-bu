import {
  GameState,
  GameStateView,
  PlayerKey,
  PlayersView,
} from '../../shared'

export function toView(gs: GameState, playerKey: string): GameStateView {
  let yourKey

  const players = Object.keys(gs.players).reduce((players, iKey) => {
    const key = iKey as PlayerKey
    const player = gs.players[key]

    players[key] = player

    if (player?.key === playerKey) yourKey = key

    return players 
  }, {} as PlayersView)

  if (!yourKey) throw new Error('')

  const yourTurn = yourKey === gs.activePlayer && gs.started

  const view: any = { 
    ...gs,
    players,
    yourKey,
    yourTurn,
  }

  delete view.deck
  delete view.discard

  return view
}
