import {
  prompt
} from 'inquirer'

import {
  Action
} from 'skip-models'

export const textQuestion = async (message: string) => {
  return (await prompt({
    name: 'response',
    type: 'input',
    message,
  })).response
}

export const listQuestion = async (message: string, choices: { name: string, value: string | Action }[]) => {
  return (await prompt({
    name: 'response',
    type: 'list',
    message,
    choices,
  })).response
}
