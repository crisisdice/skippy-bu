import 'dotenv/config'

import {
  authorization,
  lobby,
  game,
} from './prompts'

import {
  LoginClient,
  LobbyClient,
  GameClient,
} from './clients'

async function main() {

  const { apiURL, wsURL } = readEnv()

  const token = await authorization(new LoginClient(apiURL))

  const { key, action } = await lobby(new LobbyClient(apiURL, token))

  await game(new GameClient(wsURL, key, token, action))

}

function readEnv() {
  const apiURL = process.env.API_URL
  const wsURL = process.env.WS_URL

  if (!apiURL) throw new Error('API URL not set')
  if (!wsURL) throw new Error('WS URL not set')

  return { apiURL, wsURL }
}

main()

