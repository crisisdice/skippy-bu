import 'dotenv/config'  

import { createSpinner } from 'nanospinner'
import { SecureClient} from '../utils'
import { listQuestion } from '../utils'
import { GameStateView } from '../engine'
import { printASCIIPlayerView } from '../rendering'
import {GameClient} from '../utils/ws'

async function initialMethod() {
  const method = await listQuestion('What you you like to do?', ['Join a game', 'Create a game'])
  return method === 'Join a game'
}

async function listGames(games: GameStateView[]) {
  if (!games.length) return null
  // TODO figure out how to use objects with inquirer
  return await listQuestion('Choose a game', games.map(game => game.key))
}

export async function gamePlay(client: GameClient): Promise<void> {
  await title()
  while(true) {
    await sleep()
    console.log(`listening ${client.key()}`)
    //const join = await initialMethod()
    //console.clear()
    //const spinner = createSpinner('One moment please...').start()
    //const fetch = await (join ? client.fetchGames() : client.createGame())
    //spinner.success()

    //if (fetch && !join) return (fetch as GameStateView).key

    //const key = await listGames(fetch as GameStateView[])
    //const game = await client.joinGame(key)
    //if (!fetch || !game) throw new Error('No game :( !')
    //console.clear()
    //return game.key
  //const updated = await client.fetchGame(gameKey)
  //if (!updated) throw Error()
  //console.clear()
  //console.log(printASCIIPlayerView(updated.yourKey, null, updated))
  }
}

const title = async () => {
  await sleep()
}
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms))

