import {
  authorization,
  gameLobby,     //lobby
} from './pages' //prompts

import {
  LoginClient,
  SecureClient,
} from './utils' //clients

async function main() {
  const { apiURL, wsURL } = readEnv()

  const token = await authorization(new LoginClient(apiURL))

  await gameLobby(new SecureClient(apiURL, wsURL, token))
}

function readEnv() {
  const apiURL = process.env.API_URL
  const wsURL = process.env.WS_URL

  if (!apiURL) throw new Error('API URL not set')
  if (!wsURL) throw new Error('WS URL not set')

  return { apiURL, wsURL }
}

main()
