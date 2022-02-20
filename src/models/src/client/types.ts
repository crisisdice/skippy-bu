import { Source } from '../shared'

export type ListQuestion = <T>(a: string, b: { name: string, value: T }[]) => Promise<T>
export type AnnotatedCard = { name: string, value: { source: Source, card: number } } 

