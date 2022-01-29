import {
  initalizeGameState,
} from './objects'

import {
  shuffleAndDraw,
} from './methods'

import {
  GameState
} from './types'

import {
  toView,
} from './view'

function indentedJson(obj: any): string {
  return JSON.stringify(obj, undefined, 2)
}

function sampleHand() {
  const playerName = 'player_1' 

  let gs: GameState = initalizeGameState()

  gs = shuffleAndDraw(gs)

  const obj = {
    player_name: playerName,
    hand: gs[playerName].hand,
    view: toView(gs)
  }
  console.log(indentedJson(obj))

  console.log(indentedJson(gs))
}

sampleHand()
