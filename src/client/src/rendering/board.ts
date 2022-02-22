import {
  GameStateView, PileKey, PlayerKey, PlayerView, Piles, Source
} from 'skip-models'
import {g} from '../i8n'

import { getParent } from './utils'

export type HTMLCard = HTMLElement

function renderCard(card: number | '*', source: Source, selectedClass = 'unselected', isYou = false): HTMLCard {
  const boarder = document.createElement('label')
  boarder.classList.add('card')
  boarder.classList.add('unselected')
  if (isYou) boarder.addEventListener('click', selected(boarder, selectedClass))
  const value = document.createElement('span')
  value.classList.add('rank')
  value.innerHTML = card.toString()
  boarder.appendChild(value)
  boarder.setAttribute('source', source)//
  return boarder
}

function renderPile(pile: number[], key: PileKey, isYou = false, shared = false): HTMLCard {
  if (shared && isYou) throw new Error('wrong')
  const card = pile?.[0]
  if (!card) return renderCard('*', key as Source)
  return renderCard(
    card,
    key as Source,
    shared
      ? 'buildingselected'
      : 'pileselected',
    isYou,
  )
}

function renderPlayer(player: PlayerView, isYou = false) {
  return renderRow(player.discard, player.nickname, isYou, false, player.stock?.[0])
}

function renderRow(piles: Piles, text: string, isYou = false, shared = false, stock?: number) {
  const element = init(text);
  (Object.keys(piles) as PileKey[]).forEach(key => {
    element.appendChild(renderPile(piles[key], key, isYou, shared))
  })
  if (stock) element.appendChild(renderCard(stock, Source.STOCK))
  return element
}

function renderHand(player: PlayerView) {
  const element = init(g.yourHand)
  player.hand?.forEach(card => {
    element.appendChild(renderCard(card, Source.HAND, 'handselected', true))
  })
  return element
}

function renderOtherPlayers(state: GameStateView) {
  return (Object.keys(state.players) as PlayerKey[])
    .filter(key => key !== state.yourKey)
    .map(key => state.players[key])
    .filter((player): player is PlayerView => !!player)
    .map(player => renderPlayer(player))
}

export function render(state: GameStateView) {
  const parent = getParent()
  parent.textContent = ''
  const you = state.players[state.yourKey]
  if (!you) throw new Error('')

  const others = renderOtherPlayers(state)
  const building = renderRow(state.building, g.sharedPiles, false, true)
  const player = renderPlayer(you, true)
  const hand = renderHand(you)

  others.forEach(other => parent.appendChild(other))

  parent.appendChild(building)
  parent.appendChild(player)
  parent.appendChild(hand)
}

function init(text: string) {
  const element = document.createElement('div')
  element.classList.add('playingCards')
  const label = document.createElement('span')
  label.classList.add('class', 'pileLabel')
  label.innerHTML = text
  element.appendChild(label)
  return element
}

function selected(element: HTMLElement, selectedClass: string) {
  return () => {
    Array.from(document.getElementsByClassName('card'))
      .forEach(card => {
          card.classList.add('unselected')
          card.classList.remove(selectedClass)
      })
    element.classList.remove('unselected')
    element.classList.add(selectedClass)
  }
}

