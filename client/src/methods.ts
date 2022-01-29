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
