import { prompt }from 'inquirer'
import { createSpinner } from 'nanospinner'
import {login, SecureClient} from './methods'

let playerName: string
let token: string

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

async function handleAnswer(isCorrect: boolean) {
  const spinner = createSpinner('Checking answer...').start()
  await sleep()

  if (isCorrect) {
    spinner.success({ text: `Nice work ${playerName}. That's a legit answer` })
  } else {
    spinner.error({ text: `💀💀💀 Game over, you lose ${playerName}!` })
    process.exit(1)
  }
}

async function askName() {
}

async function method() {
  const answers = await prompt({
    name: 'welcome',
    type: 'list',
    message: 'Login or Register',
    choices: [
      'Login',
      'Register',
    ],
  })
}

async function loginPrompt() {
  const email = (await prompt({
    name: 'email',
    type: 'input',
    message: 'What is your email?',
  })).email
  const password = (await prompt({
    name: 'password',
    type: 'input',
    message: 'What is your password?',
  })).password

  //return login(email, password)
  return login('alexanderdaily001@gmail.com', 'test')
}

async function question1() {
  const answers = await prompt({
    name: 'question_1',
    type: 'list',
    message: 'JavaScript was created in 10 days then released on\n',
    choices: [
      'May 23rd, 1995',
      'Nov 24th, 1995',
      'Dec 4th, 1995',
      'Dec 17, 1996',
    ],
  })

  return handleAnswer(answers.question_1 === 'Dec 4th, 1995')
}

// Run it with top-level await

async function main() {
  console.clear()
  const token = await loginPrompt()

  const client = new SecureClient(token)

  const game = await client.createGame()
  console.log(game)
  //await askName()
  //a/wait question1()
}

main()
