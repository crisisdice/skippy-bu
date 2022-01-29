import {
  initalizeGameState,
} from './objects'

import {
  shuffleAndDraw,
} from './methods'

import {
  GameState,
} from './types'

import {
  toView,
} from './view'

import {
  printASCIIPlayerView
} from './client'

export type PlayerView = any

function main() {
  const name = 'Alex'
  const position = 'player_1' 
  const turn = false

  let gs: GameState = initalizeGameState()

  gs = shuffleAndDraw(gs)

  const obj = {
    name,
    position,
    turn,
    hand: gs[position].hand,
    view: toView(gs)
  }

  console.log(printASCIIPlayerView(
    name,
    turn,
    obj.hand.splice(0, 4),
    obj.view
  ))
}

main()
