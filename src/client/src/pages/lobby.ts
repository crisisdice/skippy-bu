import 'dotenv/config'  

import { createSpinner } from 'nanospinner'
import { SecureClient} from '../utils'
import { listQuestion } from '../utils'
import { GameStateView } from 'engine'

async function initialMethod() {
  const method = await listQuestion('What you you like to do?', ['Join a game', 'Create a game'])
  return method === 'Join a game'
}

async function listGames(games: GameStateView[]) {
  if (!games.length) return null
  // TODO figure out how to use objects with inquirer
  return await listQuestion('Choose a game', games.map(game => game.key))
}

export async function findGame(client: SecureClient): Promise<GameStateView> {
  await title()
  while(true) {
    const join = await initialMethod()
    console.clear()
    const spinner = createSpinner('One moment please...').start()
    const fetch = await (join ? client.fetchGames() : client.createGame())
    spinner.success()

    if (fetch && !join) return fetch as GameStateView

    const key = await listGames(fetch as GameStateView[])
    const game = await client.joinGame(key)
    if (!fetch || !game) throw new Error('No game :( !')
    console.clear()
    return game
  }
}

const title = async () => {
  await sleep()
}
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms))

