import {
  bars,
  empty,
  emptyBottom,
  emptyTop,
  leftHandMargin,
  leftPileMargin,
  line,
  rightPileMargin,
  yourHand,
} from './clientConstants'

import {
  GameStateView,
  PilesView,
} from "./types";

function renderGreeting(name: string, turn: boolean) {
  return `   Hello ${ name }, it is ${ turn ? '' : 'not' } your turn.\n${
    line
  }${
    bars
  }`
}

function renderCard(card: number | null) {
  if (card === null) return '|      '
  return card.toString().length === 2
    ? (card === 99
        ? `|   S  `
        : `|  ${card}  `
      )
    : `|   ${card}  `
}

function renderName(name: string) {
  const padding = Array(18 - name.length).fill(' ').join('')
  return`  |  ${name}${padding}`
}

function renderHand(hand: number[]) {
  const padding = `${Array(5 - hand.length).fill(empty).join('')}  |\n`
  const edges = `+${hand.map(() => '------').join('+')}+${padding}`
  const sides = `${leftHandMargin}|${hand.map(() => '      ').join('|')}|${padding}`
  const cards = `${leftHandMargin}${hand.map(card => renderCard(card)).join('')}|${padding}`

  return `${
    line
  }${
    bars
  }${
    yourHand }${ edges
  }${
    sides
  }${
    cards
  }${
    sides
  }${
    leftHandMargin }${ edges
  }${
    bars
  }${
    line
  }`
}

function renderPiles(name: string, piles: PilesView) {
  const pileCards = `${Object.keys(piles).map(key => 
      renderCard(piles[key as keyof PilesView])
    ).join('')}|`
    
  return `${
    renderName(name) }${ emptyTop
  }${
    leftPileMargin }${ pileCards }${ rightPileMargin
  }${
    emptyBottom
  }${
    bars
  }`
}

export function printASCIIPlayerView(
    name: string,
    turn: boolean,
    hand: number[],
    view: GameStateView
  ) {
    return `${
      renderGreeting(name, turn)
    }${
      renderPiles('Shared piles:', view.piles)
    }${
      renderPiles('Your piles:', view.player_1)
    }${
      renderPiles('Player 2 piles:', view.player_2)
    }${
      renderHand(hand)
    }`
}

