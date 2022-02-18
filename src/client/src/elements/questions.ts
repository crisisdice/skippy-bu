import {
  prompt
} from 'inquirer'

export const textQuestion = async (message: string) => {
  return (await prompt({
    name: 'response',
    type: 'input',
    message,
  })).response
}

export const listQuestion = async <T>(message: string, choices: { name: string, value: T }[]) => {
  return (await prompt({
    name: 'response',
    type: 'list',
    message,
    choices,
  })).response
}
