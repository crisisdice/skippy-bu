import { PileKey, Source } from 'skip-models'
import { getButton } from './elements'
import { getParent } from './utils'
import { Option } from '../types'

const timeout = async (ms: number) => new Promise(res => setTimeout(res, ms))

export async function list<T>(name: string, options: Option<T>[]) {
  const parent = getParent()
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  let selected = null
  options.forEach((option) => {
    const jn = getButton(option.name, () => {
      selected = option.value
    })
    parent.appendChild(jn)
  })
  while (selected === null) await timeout(50)
  console.log(selected)
  return selected
}

export async function handQuestion(name: string) {
  const parent = getParent()
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  while (!Array.from(document.getElementsByClassName('handselected')).length) await timeout(50)
  return parseInt((Array.from(document.getElementsByClassName('handselected'))[0].firstChild as HTMLElement).innerHTML)
}

export async function discardQuestion(name: string) {
  const parent = getParent()
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  while (!Array.from(document.getElementsByClassName('pileselected')).length) await timeout(50)
  return ('pile_' + Array.from(document.getElementsByClassName('pileselected'))[0].getAttribute('pilenumber')) as PileKey
}

export async function cardQuestion(name: string): Promise<{ card: number, source: Source}> {
  const parent = getParent()
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  const seled = () => {
    const hand = Array.from(document.getElementsByClassName('handselected')).length
    const pile = Array.from(document.getElementsByClassName('pileselected')).length
    const stock = Array.from(document.getElementsByClassName('stockselected')).length

    return hand || pile || stock
  }

  while (!seled()) await timeout(50)
  const hand = Array.from(document.getElementsByClassName('handselected')).length
  const stock = Array.from(document.getElementsByClassName('stockselected')).length

  if (hand) return { card: 1, source: 'hand' as Source }
  if (stock) return { card: 1, source: 'stock' as Source }

  const n = Array.from(document.getElementsByClassName('pileselected'))[0].getAttribute('pilenumber')
  const source = 'pile_' + n as Source

  return { card: 1, source }
}

export async function playQuestion(name: string) {
  const parent = getParent()
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  while (!Array.from(document.getElementsByClassName('buildingselected')).length) await timeout(50)
  return 'pile_' + Array.from(document.getElementsByClassName('buildingselected'))[0].getAttribute('pilenumber') as PileKey
}

