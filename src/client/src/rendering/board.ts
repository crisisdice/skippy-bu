import {
  GameStateView, PileKey, PlayerKey, PlayerView
} from 'skip-models'

import { getParent } from './utils'

function renderBuilding(state: GameStateView) {
  const position = document.createElement('div')
  position.setAttribute('class', 'playingCards')

  position.appendChild(label('Builiding piles'));

  (Object.keys(state.building) as PileKey[]).forEach((key, index) => {
    const card = state.building[key].length
      ? state.building[key][0]
      : null
    const pile = document.createElement('label')
    pile.setAttribute('pilenumber', (index + 1).toString())
    pile.classList.add('card')
    pile.classList.add('unselected')
    pile.addEventListener('click', selected(pile, 'buildingselected'))
    const number = document.createElement('span')
    number.setAttribute('class', 'rank')
    number.innerHTML = card
      ? card.toString()
      : '*'
    pile.appendChild(number)
    position.appendChild(pile)
  })

  return position
}

function renderHand(player: PlayerView) {
  const position = document.createElement('div')
  position.setAttribute('class', 'playingCards')

  position.appendChild(label('Your hand'))

  player.hand?.forEach(value => {
    const card = document.createElement('label')
    card.classList.add('card')
    card.classList.add('unselected')
    card.addEventListener('click', selected(card, 'handselected'))
    const number = document.createElement('span')
    number.setAttribute('class', 'rank')
    number.innerHTML = value.toString()
    card.appendChild(number)
    position.appendChild(card)
  })

  return position
}

function renderPlayer(player: PlayerView, isYou = false) {
  const position = document.createElement('div')
  position.setAttribute('class', 'playingCards')

  position.appendChild(label(player.nickname + "'s piles"));

  (Object.keys(player.discard) as PileKey[]).forEach((key, index) => {
    const card = player.discard[key].length
      ? player.discard[key][0]
      : null

    const pile = document.createElement('label')
    pile.setAttribute('pilenumber', (index + 1).toString())
    pile.classList.add('card')
    pile.classList.add('unselected')
    if (isYou) pile.addEventListener('click', selected(pile, 'pileselected'))
    const number = document.createElement('span')
    number.setAttribute('class', 'rank')
    number.innerHTML = card
      ? card.toString()
      : '*'
    pile.appendChild(number)
    position.appendChild(pile)
  })

  const stock = document.createElement('label')
  stock.classList.add('card')
  stock.classList.add('unselected')
  if (isYou) stock.addEventListener('click', selected(stock, 'stockselected'))
  const number = document.createElement('span')
  number.setAttribute('class', 'rank')
  number.innerHTML = player.stock.length
    ? player.stock[0].toString()
    : '*'
  stock.appendChild(number)
  position.appendChild(stock)

  return position
}

function renderOtherPlayers(state: GameStateView) {
  return (Object.keys(state.players) as PlayerKey[])
    .filter(key => key !== state.yourKey)
    .map(key => state.players[key])
    .filter((player): player is PlayerView => !!player)
    .map(player => renderPlayer(player))
}

export function render(state: GameStateView) {
  const you = state.players[state.yourKey]
  if (!you) throw new Error('')
  const player = renderPlayer(you, true)
  const hand = renderHand(you)
  const building = renderBuilding(state)
  const others = renderOtherPlayers(state)
  const parent = getParent()
  parent.textContent = ''

  others.forEach(other => parent.appendChild(other))
  parent.appendChild(building)
  parent.appendChild(player)
  parent.appendChild(hand)
}

function label(text: string) {
  const element = document.createElement('span')
  element.setAttribute('class', 'pileLabel')
  element.innerHTML = text
  return element
}

function selected(element: HTMLElement, css: string) {
  return () => {
    Array.from(document.getElementsByClassName('card'))
      .forEach(card => {
          card.classList.add('unselected')
          card.classList.remove(css)
      })
    element.classList.remove('unselected')
    element.classList.add(css)
  }
}
