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

  let selected = null
  options.forEach((option) => {
    const jn = getButton(option.name, () => {
      selected = option.value
    })
    parent.appendChild(jn)
  })
  while (selected === null) await timeout(50)
  console.log(selected)
  return selected
}

async function  handQuestion(name) {
  const timeout = async ms => new Promise(res => setTimeout(res, ms))
  const parent = document.getElementById('app')
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  while (!Array.from(document.getElementsByClassName('handselected')).length) await timeout(50)
  return parseInt(Array.from(document.getElementsByClassName('handselected'))[0].firstChild.innerHTML)
}
async function  discardQuestion(name) {
  const timeout = async ms => new Promise(res => setTimeout(res, ms))
  const parent = document.getElementById('app')
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  while (!Array.from(document.getElementsByClassName('pileselected')).length) await timeout(50)
  return 'pile_' + Array.from(document.getElementsByClassName('pileselected'))[0].getAttribute('pilenumber')
}

async function cardQuestion(name) {
  const timeout = async ms => new Promise(res => setTimeout(res, ms))
  const parent = document.getElementById('app')
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  const seled = () => {
    const hand = Array.from(document.getElementsByClassName('handselected')).length
    const pile = Array.from(document.getElementsByClassName('pileselected')).length
    const stock = Array.from(document.getElementsByClassName('stockselected')).length

    return hand || pile || stock
  }

  while (!seled()) await timeout(50)
  const hand = Array.from(document.getElementsByClassName('handselected')).length
  const stock = Array.from(document.getElementsByClassName('stockselected')).length

  if (hand) return { card: 1, source: 'hand' }
  if (stock) return { card: 1, source: 'stock' }

  const n = Array.from(document.getElementsByClassName('pileselected'))[0].getAttribute('pilenumber')
  const source = 'pile_' + n

  return { card: 1, source }
}

async function  playQuestion(name) {
  const timeout = async ms => new Promise(res => setTimeout(res, ms))
  const parent = document.getElementById('app')
  const question = document.createElement('span')
  question.innerHTML = name
  parent.appendChild(question)

  while (!Array.from(document.getElementsByClassName('buildingselected')).length) await timeout(50)
  return 'pile_' + Array.from(document.getElementsByClassName('buildingselected'))[0].getAttribute('pilenumber')
}

function label(text) {
  const element = document.createElement('span')
  element.setAttribute('class', 'pileLabel')
  element.innerHTML = text
  return element
}

function selected(element, css) {
  return () => {
    Array.from(document.getElementsByClassName('card'))
      .forEach(card => {
          card.classList.add('unselected')
          card.classList.remove(css)
      })
    element.classList.remove('unselected')
    element.classList.add(css)
  }
}

function renderBuilding(state) {
  const position = document.createElement('div')
  position.setAttribute('class', 'playingCards')

  position.appendChild(label('Builiding piles'))

  Object.keys(state.building).forEach((key, index) => {
    const card = state.building[key].length
      ? state.building[key][0]
      : null
    const pile = document.createElement('label')
    pile.setAttribute('pilenumber', index + 1)
    pile.classList.add('card')
    pile.classList.add('unselected')
    pile.addEventListener('click', selected(pile, 'buildingselected'))
    const number = document.createElement('span')
    number.setAttribute('class', 'rank')
    number.innerHTML = card
      ? card
      : '*'
    pile.appendChild(number)
    position.appendChild(pile)
  })

  return position
}

function renderHand(player) {
  const position = document.createElement('div')
  position.setAttribute('class', 'playingCards')

  position.appendChild(label('Your hand'))

  player.hand.forEach(value => {
    const card = document.createElement('label')
    card.classList.add('card')
    card.classList.add('unselected')
    card.addEventListener('click', selected(card, 'handselected'))
    const number = document.createElement('span')
    number.setAttribute('class', 'rank')
    number.innerHTML = value
    card.appendChild(number)
    position.appendChild(card)
  })

  return position
}

function renderPlayer(player, isYou = false) {
  const position = document.createElement('div')
  position.setAttribute('class', 'playingCards')

  position.appendChild(label(player.nickname + "'s piles"))

  Object.keys(player.discard).forEach((key, index) => {
    const card = player.discard[key].length
      ? player.discard[key][0]
      : null

    const pile = document.createElement('label')
    pile.setAttribute('pilenumber', index + 1)
    pile.classList.add('card')
    pile.classList.add('unselected')
    if (isYou) pile.addEventListener('click', selected(pile, 'pileselected'))
    const number = document.createElement('span')
    number.setAttribute('class', 'rank')
    number.innerHTML = card
      ? card
      : '*'
    pile.appendChild(number)
    position.appendChild(pile)
  })

  const stock = document.createElement('label')
  stock.classList.add('card')
  stock.classList.add('unselected')
  if (isYou) stock.addEventListener('click', selected(stock, 'stockselected'))
  const number = document.createElement('span')
  number.setAttribute('class', 'rank')
  number.innerHTML = player.stock.length
    ? player.stock[0]
    : '*'
  stock.appendChild(number)
  position.appendChild(stock)

  return position
}

function renderOtherPlayers(state) {
  return Object.keys(state.players)
    .filter(key => key !== state.yourKey)
    .map(key => state.players[key])
    .filter(player => !!player)
    .map(player => renderPlayer(player))
}

function render(state) {
  const player = renderPlayer(state.players[state.yourKey], true)
  const hand = renderHand(state.players[state.yourKey])
  const building = renderBuilding(state)
  const others = renderOtherPlayers(state)

  const parent = document.getElementById('app')
  parent.textContent = ''
  others.forEach(other => parent.appendChild(other))
  parent.appendChild(building)
  parent.appendChild(player)
  parent.appendChild(hand)
}

async function ws(key, token, isCreate) {
  skippy.configureWs(
    'ws://localhost:3002',
    key,
    token,
    isCreate,
    list,
    handQuestion,
    discardQuestion,
    cardQuestion,
    playQuestion,
    render
  )
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
