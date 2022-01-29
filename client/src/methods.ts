import axios from 'axios'

const URL = 'http://localhost:3001'
const endpoints = {
  login: '/users/login'
}

export async function login(email: string, password: string) {
  const { data: token } = await axios.post(`${URL}${endpoints.login}`, {
    email,
    password
  })

  return token
}

export async function register(email: string, password: string, nickname: string) {
  // TODO
}

// TODO figure out token headers (client/server)
// TODO endpoints constant

export async function createGame() {
  // TODO
}

export async function joinGame() {
  // TODO
}

export async function showGames() {
  // TODO
}

export async function startGame() {
  // TODO
}

