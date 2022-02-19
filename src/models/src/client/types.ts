import {
  PileKey,
  Source,
  Action,
} from '../shared'

export type ListQuestion = <T>(a: string, b: { name: string, value: T }[]) => Promise<T>

export type MoveArgs = {
  action: Action
  source?: Source
  card?: number
  target?: PileKey
  sourceKey?: PileKey
}

export type AnnotatedCard = { name: string, value: { source: Source, card: number, key?: PileKey } } 
