import {
  Action
} from 'skip-models'

import {
  listQuestion,
  spinner,
} from '../elements'

import {
  SecureClient
} from '../clients'

import {
  t,
} from '../i8n'

async function createGameAndJoin(client: SecureClient): Promise<void> {
  const spin = spinner()
  const games = await client.fetchGames()
  //TODO if games === [] show error
  spin.success()
  const key = await listQuestion(t.choose, games)
  console.clear()
  return await client.joinGame(key)
}

export async function lobby(client: SecureClient): Promise<void> {
  while (true) {

    console.clear()

    const isCreate = (
      await listQuestion(t.lobbyPrompt, [
        { name: t.join, value: Action.JOIN },
        { name: t.create, value: Action.CREATE },
      ])
    ) === Action.CREATE

    console.clear()

    return await (
      isCreate 
        ? client.createGame()
        : createGameAndJoin(client)
    )
  }
}

