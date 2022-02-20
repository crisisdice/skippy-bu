import { listQuestion, spinner } from '../elements'
import { t } from '../i8n'
import { CreateGame, FetchGames, LobbyReturn } from '../types'
import { Action } from './actions'

async function selectGame(fetch: FetchGames): Promise<string | null> {
  const spin = spinner()
  const games = await fetch()
  
  if (!games.length) {
    spin.error({ text: t.noGameFound })
    return null
  }
  spin.success()
  return await listQuestion(t.choose, games)
}

export async function lobby(create: CreateGame, fetch: FetchGames): LobbyReturn {
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
      ? await create()
      : await selectGame(fetch)
    
    if (!key) continue

    console.clear()

    return { key, isCreate }
  }
}

