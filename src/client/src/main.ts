import 'dotenv/config'
import {
  authorizationClient,
  lobbyClient,
  gameClient,
} from './clients'
import {
  routes,
  configureWs,
} from 'skip-models'
import { authorization, lobby } from './prompts'
import { listQuestion } from './elements'

async function main() {

  const { apiURL, wsURL } = readEnv()

  const { login, register } = authorizationClient(`${apiURL}/${routes.users}`)

  const token = await authorization(login, register)

  const { create, fetch } = lobbyClient(`${apiURL}/${routes.games}`, token)

  const { key, isCreate } = await lobby(create, fetch)

  const { firstMessage, update } = configureWs(key, token, isCreate, listQuestion)

  gameClient({ wsURL, firstMessage, update })

}

function readEnv() {
  const apiURL = process.env.API_URL
  const wsURL = process.env.WS_URL

  if (!apiURL) throw new Error('API URL not set')
  if (!wsURL) throw new Error('WS URL not set')

  return { apiURL, wsURL }
}

main()

