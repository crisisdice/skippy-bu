import {
  Injectable,
  CanActivate,
  ExecutionContext
} from '@nestjs/common'

import {
  Request,
  Response
} from 'express'

import axios from 'axios'

import {
  ConfigService
} from '@nestjs/config'

import {
  verify
} from 'jsonwebtoken'

import {
  Token,
  User,
} from 'skip-models'

@Injectable()
export class AuthGuard implements CanActivate {
  private verifyUser: (token: string) => Promise<User>

  constructor(configService: ConfigService) {
    // TODO centrally validate .env variables
    const endpoint = `${configService.get<string>('CRUD_URL')}/users/locate`
    const secret = configService.get<string>('SECRET') ?? ''
    this.verifyUser = setUpUserVerification(endpoint, secret)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>()
      const token = req.headers?.authorization?.split(' ')?.[1]

      if (!token) return false
      const user = await this.verifyUser(token)
      if (!user) return false

      const res = context.switchToHttp().getResponse<Response>()
      res.locals.user = user
      return true
    } catch (e) {
      return false
    }
  }
}

export function setUpUserVerification(endpoint: string, secret: string): (token: string) => Promise<User> {
  return async (token: string) => {
    const decoded = verify(token, secret) as Token
    const { data: user } = await axios.get(endpoint, {
      params: {
        key: decoded.key
      }
    })
    return user
  }
}

