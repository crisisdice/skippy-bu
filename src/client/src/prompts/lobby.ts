import {
  Action
} from 'skip-models'

import {
  listQuestion,
  spinner,
} from '../elements'

import {
  LobbyClient
} from '../clients'

import {
  t,
} from '../i8n'

async function selectGame(client: LobbyClient): Promise<string> {
  const spin = spinner()
  const games = await client.fetchGames()
  //TODO if games === [] show error
  spin.success()
  const key = await listQuestion(t.choose, games)
  console.clear()
  return key
}

export async function lobby(client: LobbyClient): Promise<{ key: string, action: Action.CREATE | Action.JOIN }> {
  while (true) {

    console.clear()

    const isCreate = (
      await listQuestion(t.lobbyPrompt, [
        { name: t.join, value: Action.JOIN },
        { name: t.create, value: Action.CREATE },
      ])
    ) === Action.CREATE

    console.clear()

    return isCreate 
      ? { key: (await client.createGame()), action: Action.CREATE }
      : { key: (await selectGame(client)), action: Action.JOIN }
  }
}

