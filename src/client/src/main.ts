import 'dotenv/config'

import {
  authorization,
  lobby,
} from './prompts'

import {
  authorizationClient,
  lobbyClient,
  game,
} from './clients'

import {
  routes
} from 'skip-models'

// TODO catch initialization errors
// TODO client error handling (email/nickname taken)
// TODO client validation

async function main() {

  const { apiURL, wsURL } = readEnv()

  const { login, register } = authorizationClient(`${apiURL}/${routes.users}`)

  const token = await authorization(login, register)

  const { create, fetch } = lobbyClient(`${apiURL}/${routes.games}`, token)

  const { key, action } = await lobby(create, fetch)

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

