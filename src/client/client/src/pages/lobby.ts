import 'dotenv/config'  

import { createSpinner } from 'nanospinner'

import { Game } from '@prisma/client'

import { SecureClient} from '../utils'
import { listQuestion } from '../utils'

async function initialMethod() {
  const method = await listQuestion('What you you like to do?', ['Join a game', 'Create a game'])
  return method === 'Join a game'
}

async function listGames(games: Game[]) {
  return listQuestion('Choose a game', games.map(game => game.toString()))
}

export async function findGame(client: SecureClient) {
  await title()
  while(true) {
    const join = await initialMethod()
    console.clear()
    const spinner = createSpinner('One moment please...').start()
    const game = join ? await listGames((await client.fetchGames())) : (await client.createGame())
    if (!game) throw new Error('No game :( !')
    spinner.success()
    console.clear()
    return game
  }
}

const title = async () => {
  await sleep()
}
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms))

