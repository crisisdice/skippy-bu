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

export async function gameLobby(client: SecureClient): Promise<void> {
  await title()

  while (true) {
    const isCreate = await initialMethod()

    if (isCreate) return await client.createGame()

    const spinner = createSpinner('One moment please...').start()
    const games = await client.fetchGames()
    //TODO if games === [] show error
    spinner.success()
    console.clear()
    const key = await listGames(games as GameStateView[])
    return await client.joinGame(key)
  }
}

const title = async () => {
  await sleep()
  console.clear()
}
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms))

