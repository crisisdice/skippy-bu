import { Response } from 'express'
import { User } from '@prisma/client'

export function getUser(res: Response): User {
  return res.locals.user
}
