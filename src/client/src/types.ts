import { Source } from 'skip-models'

export type ListQuestion = <T>(question: string, options: Option<T>[]) => Promise<T>
export type Option<T> = { name: string, value: T }

export type AnnotatedCard = { name: string, value: { source: Source, card: number } } 

