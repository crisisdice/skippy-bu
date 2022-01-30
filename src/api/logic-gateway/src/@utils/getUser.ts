import { Response } from 'express'
import { User } from '@prisma/client'
import { UserMetadata } from 'engine'

export function getUser(res: Response): User {
  return res.locals.user
}

export function getMetadata(user: User): UserMetadata {
  return user.metadata as UserMetadata
}

