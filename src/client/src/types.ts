import { Credentials } from 'skip-models'

export type NullableStringPromise = Promise<string | null>

export type CreateGame = () => NullableStringPromise
export type FetchGames = () => Promise<{ name: string, value: string }[]>

export type Login = (args: Omit<Credentials, 'nickname'>) => NullableStringPromise
export type Register = (args: Credentials) => NullableStringPromise
