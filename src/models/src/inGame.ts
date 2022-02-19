import WebSocket from 'ws'

import {
  PlayerView,
  PlayerKey,
} from './types'

import {
  g,
} from './i8n'

import {
  printASCIIPlayerView
} from './rendering'

import {
  Prisma,
  Game as IGame,
  User as IUser
} from '@prisma/client'

export const routes = {
  games: 'games',
  users: 'users',
}

import { GameState, GameStateView, PileKey } from './types'

export type Game = Omit<IGame, 'state'> & { state: GameState }

export type User = IUser

export type GameCreateInput = Prisma.GameCreateInput

export const enum Action {
  CREATE,
  JOIN,
  START,
  PLAY,
  DISCARD,
}

export const enum Source {
  HAND,
  STOCK,
  DISCARD,
}

export type Message = {
  token: string // for auth and to get user
  key: string   // to find game
  move: Move
}

export type Move = {
  action: Action
  source: Source
  sourceKey?: PileKey
  card: number
  target: PileKey
}

export const whereCardCanBePlayed = (card: number | null, state: GameStateView): PileKey[] => {
  if (card === null) return []
  const keys = [ 'pile_1', 'pile_2', 'pile_3', 'pile_4' ] as PileKey[]
  if (card === 99) return keys
  if (card === 1) return keys.filter(key => state.building[key].length === 0)

  return keys.filter(key => 
    (state.building[key]?.[0] === card - 1) ||
    (state.building[key]?.[0] === 99 && state.building[key]?.length === card - 1)
  )
}

const render = (state: GameStateView) => {
  console.clear()
  console.log(printASCIIPlayerView(state))
}

type ListQuestion = <T>(a: string, b: { name: string, value: T }[]) => Promise<T>

export function winnerPrompt(state: GameStateView) {
  console.log(state.winner === state.yourKey
    ? g.won
    : g.lost
  )
}

function filterPlayableCards(player: PlayerView, state: GameStateView) {
  const playableCardFilter = (card: number) => whereCardCanBePlayed(card, state).length > 0
  const getCardFromPile = (key: string) => player.discard[key as PileKey]?.[0] ?? null

  const handCards = player.hand!.filter(playableCardFilter)
    .map(card => mapCardSource(Source.HAND, card))
  const discardCards = Object.keys(player.discard)
    .filter(key => playableCardFilter(getCardFromPile(key)))
    .map(key => {
      return mapCardSource(Source.DISCARD, getCardFromPile(key), key as PileKey)
    })
  const stockCard = playableCardFilter(player.stock?.[0])
    ? [mapCardSource(Source.STOCK, player.stock?.[0])]
    : []
  
  return [ ...stockCard, ...handCards, ...discardCards ]
}


const mapPiles = (piles: PileKey[]) => {
  return piles.map(pile => {
    return {
      name: parseInt(pile.slice(-1)).toString(),
      value: pile
    }
  })
}

const mapCardSource = (source: Source, card: number, key?: PileKey) => {
  const mapping = {
    [Source.HAND]: g.hand,
    [Source.DISCARD]: g.discard,
    [Source.STOCK]: g.stock,
  }

  return {
    name: `${card === 99 ? 'S' : card.toString()} (${mapping[source]})`,
    value: {
      source,
      key: key ?? null,
      card,
    }
  }
}

export const configureWs = (key: string, token: string, isCreate: boolean, listQuestion: ListQuestion) => {
  const format = ({ action, source, card, target, sourceKey }: MoveArgs) => {
    return JSON.stringify({
      token,
      key,
      move: {
        action,
        source,
        sourceKey,
        card,
        target,
      }
    } as Message)
  }
  async function startPrompt(state: GameStateView): Promise<boolean> {
    const isCreator = state.yourKey === PlayerKey.One
    const moreThanTwoPlayers = state.players.player_2 !== null
    if (isCreator && moreThanTwoPlayers) {
      await listQuestion(g.start, [
        { name: g.ok, value: Action.START },
      ])
      return true
    }
    return false
  }

  async function turnPrompt(state: GameStateView) {
  const player = state.players[state.yourKey]
  
  if (player === null) throw new Error('Player not found')

  const playableCards = filterPlayableCards(player, state)

  const action = !playableCards.length
    ? Action.DISCARD
    : (
        await listQuestion(g.actionPrompt, [
          { name: g.play, value: Action.PLAY },
          { name: g.discardAndEnd, value: Action.DISCARD },
        ])
      )

  if (action === Action.DISCARD) {
    const handCards = player.hand!.map(card => mapCardSource(Source.HAND, card))
    const card = (await listQuestion(g.chooseDiscard, handCards)).card
    const target = await listQuestion(g.choosePile, mapPiles(Object.keys(player.discard) as PileKey[]))

    return { action, source: Source.HAND, card, target }
  }

  if (action === Action.PLAY) {
    const { source, card, key } = await listQuestion(g.choosePlay, playableCards)

    const targets = whereCardCanBePlayed(card, state)

    const target = targets.length === 1
      ? targets[0]
      : await listQuestion(g.choosePile, mapPiles(targets))

    return { action, source, card, target, sourceKey: key ?? undefined }
  }

  throw new Error('wrong action')
}
  const update = async (ws: WebSocket, data: string) => {
    const state = JSON.parse(data) as GameStateView
    render(state)
    if (!state.started && await startPrompt(state)) ws.send(format({ action: Action.START }))
    if (state.winner) {
      winnerPrompt(state)
      ws.close()
    }
    if (state.yourTurn) ws.send(format((await turnPrompt(state))))
  }
  const action = isCreate
    ? Action.CREATE
    : Action.JOIN
  const firstMessage = format({ action })
  return { firstMessage, update }
}

export type MoveArgs = {
  action: Action
  source?: Source
  card?: number
  target?: PileKey
  sourceKey?: PileKey
}

