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

async function main() {
  let client: SecureClient | null = null
  let game: Game | null = null
  const url = process.env.API ?? ''

  while(client === null && game === null) {
    const token = await authorization(new LoginClient(url))

    if (!token) console.error('no token')

    client = new SecureClient(url, token)

    const game = await findGame(client)

    if (!game) console.error('no game')
  
    console.log(game)
  }
}

main()
