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

async function selectGame(client: LobbyClient): Promise<string | null> {
  const spin = spinner()
  const games = await client.fetchGames()
  
  if (!games.length) {
    spin.error({ text: t.noGameFound })
    return null
  }
  spin.success()
  return await listQuestion(t.choose, games)
}

export async function lobby(client: LobbyClient): Promise<{ key: string, action: Action.CREATE | Action.JOIN }> {
  while (true) {

    console.clear()

    const isCreate = (
      await listQuestion(t.actionPrompt, [
        { name: t.join, value: Action.JOIN },
        { name: t.create, value: Action.CREATE },
      ])
    ) === Action.CREATE

    console.clear()

    const key = isCreate 
      ? await client.createGame()
      : await selectGame(client)

    const action = isCreate
      ? Action.CREATE
      : Action.JOIN

    if (!key) continue

    console.clear()

    return { key, action }
  }
}
