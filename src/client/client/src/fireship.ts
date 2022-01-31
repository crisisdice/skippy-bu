import { createSpinner } from 'nanospinner'

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))
async function handleAnswer(isCorrect: boolean) {
  const spinner = createSpinner('Checking answer...').start()
  await sleep()

  if (isCorrect) {
    spinner.success({ text: `Nice work. That's a legit answer` })
  } else {
    spinner.error({ text: `💀💀💀 Game over, you lose!` })
    process.exit(1)
  }
}

