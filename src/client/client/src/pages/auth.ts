import 'dotenv/config'  

import { createSpinner } from 'nanospinner'
import figlet from 'figlet'

import { LoginClient } from '../utils'
import { basicQuestion, listQuestion } from '../utils'

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

export async function authorization(client: LoginClient) {
  resetTitle()

  while(true) {
    const login = await initialMethod()

    const { email, password, nickname } = await credentials(!login)

    const spinner = createSpinner('One moment please...').start()

    const token = await (login 
      ? client.login({ email, password })
      : client.register({ email, password, nickname })
    )

    if (!token) {
      resetTitle()
      spinner.error({ text: `${ login ? 'Login' : 'Registration' } failed. Please try again.` })
      continue
    }

    spinner.success({ text: `Welcome!` })

    await sleep()

    console.clear()
    
    return token
  }
}

const resetTitle = async () => {
  console.clear()
  figlet('Skippy-Bu !\n', (err, data) => {
      console.log(data)
      console.log()
  })
  await sleep()
}

const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms))

