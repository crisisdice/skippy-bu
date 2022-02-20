import { User } from '../shared'

export type SetupArgs = { endpoint: string, verifyUser: (token: string) => Promise<User> }
