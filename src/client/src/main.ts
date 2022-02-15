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

async function main() {
  const { apiURL, wsURL } = readEnv()

  const token = await authorization(new LoginClient(apiURL))

  const gameKey = await gameLobby(new SecureClient(apiURL, token))
  
  await gamePlay(new GameClient(wsURL, token, gameKey))
}

function readEnv() {
  const apiURL = process.env.API_URL
  const wsURL = process.env.WS_URL

  if (!apiURL) throw new Error('API URL not set')
  if (!wsURL) throw new Error('WS URL not set')

  return { apiURL, wsURL }
}

main()
