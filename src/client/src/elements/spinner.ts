import {
  createSpinner
} from 'nanospinner'

import {
  t,
} from '../i8n'

export const spinner = () => {
  return createSpinner(t.oneMoment).start()
}

