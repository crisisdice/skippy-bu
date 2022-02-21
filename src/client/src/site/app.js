const getParent = () => {
  const parent   = document.getElementById('app')
  parent.textContent = ''
  return parent
}

function getInput(id, text) {
  const label = document.createElement('label')
  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('id', id)
  label.innerHTML = text
  label.appendChild(input)
  return label
}

function getButton(text, callback) {
  const button = document.createElement('button')
  button.setAttribute('class', 'styled')
  button.setAttribute('type', 'submit')
  button.addEventListener('click', callback, false)
  button.innerHTML = text
  return button
}

function renderLogin() {
  const parent = getParent()
  const em = 'em'
  const pw = 'pw'
  const email = getInput(em, 'Email ')
  const password = getInput(pw, 'Password ')
  const submit = getButton('Login', () => login(em, pw))

  parent.appendChild(email)
  parent.appendChild(password)
  parent.appendChild(submit)
}

function renderLobby(token) {
  const parent = getParent()
  const cr = getButton('Create a Game', () => create(token))
  const jn = getButton('Join a Game', () => find(token))

  parent.appendChild(cr)
  parent.appendChild(jn)
}

function renderGames(games, token) {
  const parent = getParent()
  games.forEach((game) => {
    const jn = getButton(game.state.name, () => join(game, token))
    parent.appendChild(jn)
  })
}

async function login(em, pw) {
  const email = document.getElementById(em).value
  const password = document.getElementById(pw).value
  const data = { email, password } 
  const response = await request({ method: 'PUT', endpoint: '/users', data })
  const token = response.headers.get('x-access-token')
  renderLobby(token)
}

async function create(token) {
  const game = await request({ method: 'POST', endpoint: '/games', token })
  const { key } = await game.json()
  ws(key, token, true)
}

async function join(game, token) {
  ws(game.key, token, false)
}

async function find(token) {
  const games = await (await request({ method: 'GET', endpoint: '/games', token })).json()
  renderGames(games, token)
}

async function list(name, options) {
  const timeout = async ms => new Promise(res => setTimeout(res, ms))
  const parent = document.getElementById('app')
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  let selected
  options.forEach((option) => {
    const jn = getButton(option.name, () => {
      selected = option.value
    })
    parent.appendChild(jn)
  })
  while (!selected) await timeout(50)
  return selected
}

function render(state) {
  const parent = getParent()
  const game = document.createElement('span')
  game.innerHTML = 'the game'
  parent.appendChild(game)
}

async function ws(key, token, isCreate) {
  skippy.configureWs('ws://localhost:3002', key, token, isCreate, list, render)
}

async function request({ method, endpoint, token, data }) {
  const url = 'http://localhost:3001'
  const auth = token ? { 'Authorization': `Bearer ${token}` } : undefined
  const response = await fetch(url + endpoint, {
    method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      ...auth,
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
    body: method === 'GET' ? undefined : JSON.stringify(data)
  })
  return response
}

renderLogin()
