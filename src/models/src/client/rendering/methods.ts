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
  PlayerKey,
  PlayerView,
  Piles,
  PileKey,
} from '../../shared'

import {
  greeting,
  g
} from '../i8n'

function renderGreeting(name: string, turn: boolean, started: boolean) {
  return `${greeting(name, turn, started)}\n${
    line
  }${
    bars
  }`
}

function renderCard(card?: number | null) {
  if (!card) return '|      '
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

function renderPiles(piles: Piles, stock: boolean, nickname: string, left: string, right: string) {
  const cards = `${Object.keys(piles).map(key => renderCard(piles[key as PileKey]?.[0])).join('')}|`
  return `${
    renderName(nickname)
  }${
    emptyTop(stock)
  }${
    left
  }${
    cards
  }${
    right
  }${
    emptyBottom(stock)
  }`
}

function renderPlayerPiles(player: PlayerView) {
  const { nickname, discard, stock, hand } = player
  const padding = stock.length.toString().length === 2 ? ' ' : '  '
  const renderedStock = `   ${renderCard(stock?.[0] ?? null)}| ${stock.length}${padding}|\n`
  const handCardCount = `  |  ${g.handCards}: ${hand?.length}     `
  return renderPiles(discard, true, nickname, handCardCount, renderedStock)
}

function renderBuildingPiles(piles: Piles) {
  const right = `           ${ rightPileMargin }`
  return renderPiles(piles, false, g.sharedPiles, leftPileMargin, right)
}

function renderOtherPlayers(state: GameStateView) {
  return Object.keys(state.players)
    .filter(key => key !== state.yourKey)
    .map(key => state.players[key as PlayerKey])
    .filter((player): player is PlayerView => !!player)
    .map(player => renderPlayerPiles(player)).join('')
}

export function printASCIIPlayerView(state: GameStateView) {
    const player = state.players[state.yourKey]
    const hand = player?.hand

    if (!player || !hand) throw new Error('Missing player')

    const turn = state.activePlayer
      ? state.players[state.activePlayer]?.key === player.key
      : false

    return `${
      renderGreeting(player.nickname, turn, state.started)
    }${
      renderOtherPlayers(state)
    }${
      renderBuildingPiles(state.building)
    }${
      name
    }${
      renderPlayerPiles({ ...player, hand, nickname: g.yourPiles })
    }${
      state.started
        ? renderHand(hand)
        : ''
    }${
      line
    }`
}

