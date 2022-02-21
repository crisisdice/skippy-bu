import { User } from 'skip-models'

export type SetupArgs = { endpoint: string, verifyUser: (token: string) => Promise<User> }
