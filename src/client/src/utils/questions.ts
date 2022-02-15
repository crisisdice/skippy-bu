import { prompt }from 'inquirer'

export const basicQuestion = async (message: string) => {
  return (await prompt({
    name: 'response',
    type: 'input',
    message,
  })).response
}

export const listQuestion = async (message: string, choices: string[]) => {
  return (await prompt({
    name: 'response',
    type: 'list',
    message,
    choices,
  })).response
}

export const listObjectQuestion = async (message: string, choices: { name: string, value: string}[]) => {
  return (await prompt({
    name: 'response',
    type: 'list',
    message,
    choices,
  })).response
}
