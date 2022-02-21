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
  const parent   = document.getElementById('app')
  const em = 'em'
  const pw = 'pw'
  const email = getInput(em, 'Email ')
  const password = getInput(pw, 'Password ')
  const submit   = getButton('Login', () => login(em, pw))

  parent.appendChild(email)
  parent.appendChild(password)
  parent.appendChild(submit)
}

function renderLobby(token) {
  const parent   = document.getElementById('app')
  parent.textContent = ''
  const cr = getButton('Create a Game', () => create(token))
  const jn = getButton('Join a Game', () => find(token))

  parent.appendChild(cr)
  parent.appendChild(jn)
}

function renderGames(games, token) {
  const parent   = document.getElementById('app')
  parent.textContent = ''
  
  games.forEach((game) => {
    const jn = getButton(game.state.name, () => join(game, token))
    parent.appendChild(jn)
  })
}

async function login(em, pw) {
  const email = document.getElementById(em).value
  const password = document.getElementById(pw).value
  const cred = { email, password } 
  const token = await getToken(cred)
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

async function getToken(data) {
  const response = await request({ method: 'PUT', endpoint: '/users', data })
  return response.headers.get('x-access-token')
}

async function ws(key, token, isCreate) {
  const list = async (name, options) => {
    const parent = document.getElementById('app')
    
    let next = false; // this is to be changed on user input
    let selected

    const question = document.createElement('span')
    question.innerHTML = name
    parent.appendChild(question)
    options.forEach((option) => {
      const jn = getButton(option.name, () => {
        next = true
        selected = option.value
      })
      parent.appendChild(jn)
    })

    const timeout = async ms => new Promise(res => setTimeout(res, ms));

    while (next === false) await timeout(50); // pauses script

    return selected
  }
  const render = (state) => {
    const parent   = document.getElementById('app')
    parent.textContent = ''
    const game = document.createElement('span')
    game.innerHTML = 'the game'
    parent.appendChild(game)
  }
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
