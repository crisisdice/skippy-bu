import {
  createSpinner
} from 'nanospinner'

import {
  t,
} from '../i8n'

export const spinner = () => createSpinner(t.oneMoment).start()

