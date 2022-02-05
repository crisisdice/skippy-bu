import {
  authorization,
  findGame,
} from './pages'

import {
  LoginClient,
  SecureClient
} from './utils'

import {
  Game
} from '@prisma/client'

import {
  printASCIIPlayerView
} from './rendering'

async function main() {
  let client: SecureClient | null = null
  let game: Game | null = null
  const url = process.env.API

  if (!url) throw new Error('API URL not set')

  while(client === null && game === null) {
    const token = await authorization(new LoginClient(url))

    if (!token) console.error('no token')

    client = new SecureClient(url, token)

    const game = await findGame(client)

    if (!game) console.error('no game')
  
    while (game) {
      // TODO clean this up
      //const state = typeof game.state === 'string' ? JSON.parse(game.state as string) : game.state
      
      const key = game.key
      const updated = await client.fetchGame(key)
      if (!updated) throw Error()
      console.clear()
      console.log(printASCIIPlayerView(game.yourKey, null, updated))
      await sleep(1000 * 60)
      // TODO poll for updates
    }
  }
}
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms))

main()
