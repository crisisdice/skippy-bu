import { configureWs } from '../ws'
import { render } from './board'
import { 
  list,
  handQuestion,
  discardQuestion,
  cardQuestion,
  playQuestion,
} from './questions'


export function start(key: string, token: string, isCreate: boolean) {
  configureWs(
    'ws://localhost:3002',
    key,
    token,
    isCreate,
    list,
    handQuestion,
    discardQuestion,
    cardQuestion,
    playQuestion,
    render
  )
}
