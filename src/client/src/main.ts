import 'dotenv/config'

import {
  authorization,
  lobby,
} from './prompts'

import {
  LoginClient,
  LobbyClient,
  game
} from './clients'

// TODO catch initialization errors
// TODO client error handling (email/nickname taken)
// TODO client validation

async function main() {

  const { apiURL, wsURL } = readEnv()

  const token = await authorization(new LoginClient(apiURL))

  const { key, action } = await lobby(new LobbyClient(apiURL, token))

  game(wsURL, key, token, action)
}

function readEnv() {
  const apiURL = process.env.API_URL
  const wsURL = process.env.WS_URL

  if (!apiURL) throw new Error('API URL not set')
  if (!wsURL) throw new Error('WS URL not set')

  return { apiURL, wsURL }
}

main()

