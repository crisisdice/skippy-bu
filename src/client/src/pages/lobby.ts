import {
  createSpinner
} from 'nanospinner'

import {
  SecureClient
} from '../utils'

import {
  listQuestion,
  listObjectQuestion,
} from '../utils'

import {
  GameStateView
} from 'skip-models'

async function initialMethod() {
  const method = await listQuestion('What you you like to do?', ['Join a game', 'Create a game'])
  return method === 'Create a game'
}

async function listGames(games: GameStateView[]): Promise<string> {
  return await listObjectQuestion('Choose a game', games.map(game => {
    return {
      name: game?.players?.player_1?.nickname ?? 'test game',
      value: game.key,
    }
  }))
}

export async function gameLobby(client: SecureClient): Promise<{ key: string, created: boolean }> {
  await title()

  while(true) {
    const isCreate = await initialMethod()
    console.clear()
    const spinner = createSpinner('One moment please...').start()
    const games = await (isCreate ? client.createGame() : client.fetchGames())
    spinner.success()
    console.clear()
    if (isCreate) return { key: (games as GameStateView).key, created: true }
    //TODO if games === [] show error
    const game = await listGames(games as GameStateView[])
    spinner.start()
    const key = (await client.joinGame(game)).key
    spinner.success()
    console.clear()
    return { key, created: false }
  }
}

const title = async () => {
  await sleep()
}
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms))

