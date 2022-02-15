import {
  authorization,
  gameLobby,
  gamePlay,
} from './pages'

import {
  LoginClient,
  SecureClient,
  GameClient,
} from './utils'

import { Action } from 'skip-models'

async function main() {
  const { apiURL, wsURL } = readEnv()

  const token = await authorization(new LoginClient(apiURL))

  const { key, created } = await gameLobby(new SecureClient(apiURL, token))
  
  const action = created ? Action.CREATE : Action.JOIN

  await gamePlay(new GameClient(wsURL, token, key, action))
}

function readEnv() {
  const apiURL = process.env.API_URL
  const wsURL = process.env.WS_URL

  if (!apiURL) throw new Error('API URL not set')
  if (!wsURL) throw new Error('WS URL not set')

  return { apiURL, wsURL }
}

main()
