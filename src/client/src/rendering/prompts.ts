import { getButton, getInput } from './elements'
import { request } from './request'
import { getParent } from './utils'
import { start } from './start'

export function renderLogin() {
  const parent = getParent()
  const em = 'em'
  const pw = 'pw'
  const email = getInput(em, 'Email ')
  const password = getInput(pw, 'Password ')

  const login = async (em: string, pw: string) => {
    const email = (document.getElementById(em) as HTMLInputElement).value
    const password = (document.getElementById(pw) as HTMLInputElement).value
    const data = { email, password } 
    const response = await request({ method: 'PUT', endpoint: '/users', data })
    const token = response.headers.get('x-access-token')
    if (!token) throw new Error('')
    renderLobby(token)
  }
  const submit = getButton('Login', () => login(em, pw))

  parent.appendChild(email)
  parent.appendChild(password)
  parent.appendChild(submit)
}

function renderLobby(token: string) {
  const parent = getParent()
  parent.textContent = ''

  const create = async (token: string) => {
    const game = await request({ method: 'POST', endpoint: '/games', token })
    const { key } = await game.json()
    start(key, token, true)
  }
  const find = async (token: string) => {
    const games = await (await request({ method: 'GET', endpoint: '/games', token })).json()
    renderGames(games, token)
  }
  const cr = getButton('Create a Game', () => create(token))
  const jn = getButton('Join a Game', () => find(token))

  parent.appendChild(cr)
  parent.appendChild(jn)
}

function renderGames(games: Game[], token: string) {
  const parent = getParent()
  parent.textContent = ''
  const join = async (game: Game, token: string) => {
    start(game.key, token, false)
  }
  games.forEach((game) => {
    const jn = getButton(game.state.name, () => join(game, token))
    parent.appendChild(jn)
  })
}

type Game = {
  key: string
  state: {
    name: string
  }
}

