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
  PlayerKey,
  PlayerView,
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

function renderPiles(name: string, piles: PilesView | null) {
  if (!piles) return ''

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
    position: PlayerKey,
    turn: boolean,
    hand: number[],
    view: GameStateView,
  ) {
    const player = view[position] as PlayerView

    if (player === null) throw new Error('Missing player')

    return `${
      renderGreeting(player.name, turn)
    }${
      renderPiles('Shared piles:', view.piles)
    }${
      renderPiles('Your piles:', player.piles)
    }${
      Object.keys(view)
            .filter(key => key !== position && key !== 'piles')
            .filter(key => view[key as PlayerKey] !== null)
            .map(key => {
              return renderPiles(view[key as PlayerKey]!.name, view[key as PlayerKey]!.piles)
            }).join('')
    }${
      renderHand(hand)
    }`
}

