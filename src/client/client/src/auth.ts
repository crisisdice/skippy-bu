import 'dotenv/config'  
import { LoginClient, SecureClient} from './http'
import { basicQuestion, listQuestion } from './questions'

async function initialMethod() {
  const method = await listQuestion('Login or Register', ['Login', 'Register'])
  return method === 'Login'
}

async function credentials(askName: boolean = false) {
  const email = await basicQuestion('What is your email?')
  const password = await basicQuestion('What is your password?')
  const nickname = askName ? (await basicQuestion('What is your nickname?')) : ''
  // TODO client validation
  return { email, password, nickname}
}

export async function authorization() {
  console.clear()
  const url = process.env.API ?? ''
  const client = new LoginClient(url)

  const login = await initialMethod()
  const { email, password, nickname } = await credentials(!login)
  const token = await (login 
    ? client.login({ email, password })
    : client.register({ email, password, nickname })
  )

  if (!token) throw new Error('Authorization failed')

  return new SecureClient(url, token)
}

