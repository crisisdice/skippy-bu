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
  name,
} from './constants'

import {
  GameStateView,
  PilesView,
  PlayerKey,
  Piles,
  PileKey,
} from 'skip-models'

function renderGreeting(name: string, turn: boolean, started: boolean) {
  const greeting = started
    ? `   Hello ${ name }, it is${ turn ? '' : ' not' } your turn.`
    : `Hello and welcome, ${ name }.`

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
  const padding = Array(17 - name.length).fill(' ').join('')
  return`  |  ${name}:${padding}`
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
  }`
}

function renderPiles(name: string, handCards: number, piles: PilesView | null, stock: number[]) {
  if (!piles) return ''

  const pileCards = `${Object.keys(piles).map(key => 
      renderCard(piles[key as keyof PilesView])
    ).join('')}|`

  const padding = stock.length.toString().length === 2 ? ' ' : '  '
  const renderedStock = `   ${renderCard(stock?.[0] ?? null)}| ${stock.length}${padding}|\n`
  const handCardCount = `  |  Hand cards: ${handCards}     `
    
  return `${
    renderName(name) }${ emptyTop(true)
  }${
    handCardCount }${ pileCards }${renderedStock}${
    emptyBottom(true)
  }`
}

function renderBuildingPiles(name: string, piles: Piles) {
  if (!piles) return ''

  const pileCards = `${Object.keys(piles).map(key => 
      renderCard(piles[key as PileKey]?.[0] ?? null)
    ).join('')}|`

  return `${
    renderName(name) }${ emptyTop(false)
  }${
    leftPileMargin }${ pileCards }           ${ rightPileMargin
  }${
    emptyBottom(false)
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
      return renderPiles(player!.nickname, player!.hand.length, player!.discard, player!.stock)
    }).join('')
}

export function printASCIIPlayerView(state: GameStateView) {
    const player = state.players[state.yourKey]

    if (player === null) throw new Error('Missing player')

    const turn = state.activePlayer
      ? state.players[state.activePlayer]?.key === player.key
      : false

    return `${
      renderGreeting(player.nickname, turn, state.started)
    }${
      renderOtherPlayers(state, player.key)
    }${
      renderBuildingPiles('Shared piles', state.building)
    }${
      name
    }${
      renderPiles('Your piles', player.hand.length, player.discard, player.stock)
    }${
      state.started
        ? renderHand(player.hand)
        : ''
    }${
      line
    }`
}

