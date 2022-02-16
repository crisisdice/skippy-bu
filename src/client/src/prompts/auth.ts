import {
  createSpinner
} from 'nanospinner'

import {
  LoginClient
} from '../clients'

import {
  basicQuestion,
  listQuestion
} from '../utils'

async function initialMethod() {
  const method = await listQuestion('Login or Register', ['Login', 'Register'])
  return method === 'Login'
}

async function credentials(isLogin: boolean) {
  const email = await basicQuestion('What is your email?')
  const password = await basicQuestion('What is your password?')
  const nickname = isLogin ? '' : (await basicQuestion('What is your nickname?'))
  // TODO client validation
  return { email, password, nickname }
}

export async function authorization(client: LoginClient) {
  await resetTitle()

  while(true) {
    const isLogin = await initialMethod()
    const { email, password, nickname } = await credentials(isLogin)
    const spinner = createSpinner('One moment please...').start()
    const token = await (isLogin 
      ? client.login({ email, password })
      : client.register({ email, password, nickname })
    )
    if (!token) {
      resetTitle()
      spinner.error({ text: `${ isLogin ? 'Login' : 'Registration' } failed. Please try again.` })
      continue
    }
    spinner.success({ text: `Welcome!` })
    await sleep()
    console.clear()
    return token
  }
}

const resetTitle = async () => {
  const title = `
    ____  _    _                         ____          _ 
   / ___|| | _(_)_ __  _ __  _   _      | __ ) _   _  | | 
   \\___ \\| |/ / | '_ \\| '_ \\| | | |     |  _ \\| | | | | | 
    ___) |   <| | |_) | |_) | |_| |     | |_) | |_| | |_|
   |____/|_|\\_\\_| .__/| .__/ \\__, |     |____/ \\__,_| (_)
                |_|   |_|    |___/                       
  `
  console.clear()
  console.log(title)
  await sleep()
}

const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms))

