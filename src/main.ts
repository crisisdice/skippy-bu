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

function main() {
  let gs: GameState = initalizeGameState()
  gs = shuffleAndDraw(gs)

  const mapping = {
    player_1: 'Benjamin',
    player_2: 'Alex',
    player_3: '',
    player_4: '',
    player_5: '',
    player_6: ''
  }

  const position = 'player_1' 
  const turn = false
  const hand = gs[position].hand
  const view = toView(gs, mapping)

  console.log(
    printASCIIPlayerView(
      position,
      turn,
      hand,
      view
    )
  )
}

main()
