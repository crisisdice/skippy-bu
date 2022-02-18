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
} from './constants'

import {
  GameStateView,
  PilesView,
  PlayerKey,
} from 'skip-models'

function renderGreeting(name: string, turn: boolean | null) {
  const greeting = turn === null
    ? `Hello and welcome, ${ name }.`
    : `   Hello ${ name }, it is${ turn ? '' : ' not' } your turn.`

  return `${greeting}\n${
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

export function renderHand(hand: number[]) {
  const padding = `${Array(5 - hand.length).fill(empty).join('')}             |\n`
  const edges = `+${hand.map(() => '------').join('+')}+${padding}`
  const sides = `${leftHandMargin}|${hand.map(() => '      ').join('|')}|${padding}`
  const cards = `${leftHandMargin}${hand.map(card => renderCard(card)).join('')}|${padding}`

  return `${
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

function renderPiles(name: string, piles: PilesView | null, stock?: number) {
  if (!piles) return ''

  const pileCards = `${Object.keys(piles).map(key => 
      renderCard(piles[key as keyof PilesView])
    ).join('')}|`

  const withStock = !!stock
  const renderedStock = withStock ? `   ${renderCard(stock)}|`: '           '
    
  return `${
    renderName(name) }${ emptyTop(withStock)
  }${
    leftPileMargin }${ pileCards }${renderedStock}${ rightPileMargin
  }${
    emptyBottom(withStock)
  }${
    bars
  }`
}

function renderOtherPlayers(state: GameStateView, playerKey: string) {
  return Object
    .keys(state.players)
    .filter(key => key !== 'piles')
    .filter(key => {
      const player = state.players[key as PlayerKey]
      return player !== null && player.key !== playerKey
    })  
    .map(key => {
      const player = state.players[key as PlayerKey]
      return renderPiles(player!.nickname, player!.discard, player!.stock)
    }).join('')
}

export function printASCIIPlayerView(state: GameStateView) {
    const player = state.player

    if (player === null) throw new Error('Missing player')

    const turn = state.activePlayer
      ? state.players[state.activePlayer]?.key === player.key
      : false

    return `${
      renderGreeting(player.nickname, turn)
    }${
      renderPiles('Shared piles:', state.building)
    }${
      renderPiles('Your piles:', player.discard, player.stock)
    }${
      renderOtherPlayers(state, player.key)
    }${
      line
    }${
      state.activePlayer !== null
      ? renderHand(player.hand)
      : ''
    }`
}

