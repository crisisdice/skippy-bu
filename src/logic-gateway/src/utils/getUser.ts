import { Response } from 'express'
import { User } from 'skip-models'

export function getUser(res: Response): User {
  return res.locals.user
}

