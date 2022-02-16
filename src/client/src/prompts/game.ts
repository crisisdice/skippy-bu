import {
  Action
} from 'skip-models'

import {
  listQuestion,
  spinner,
} from '../elements'

import {
  GameClient,
} from '../clients'

import {
  t,
} from '../i8n'

export async function game(client: GameClient): Promise<string> {
  while (true) {

    console.clear()

    const isCreate = (
      await listQuestion(t.lobbyPrompt, [
        { name: t.join, value: Action.JOIN },
        { name: t.create, value: Action.CREATE },
      ])
    ) === Action.CREATE
  }
}

