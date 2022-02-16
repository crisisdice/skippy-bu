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
} from 'skip-models'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>()
      const res = context.switchToHttp().getResponse<Response>()
      const token = req.headers?.authorization?.split(' ')?.[1]
      const endpoint = `${this.configService.get<string>('CRUD_URL')}/users/locate`

      if (!token) return false

      const user = await verifyUser(token, endpoint)

      if (!user) return false

      res.locals.user = user
      return true
    } catch (e) {
      return false
    }
  }
}

export async function verifyUser(token: string, url: string) {
  const decoded = verify(token, 'secret') as Token
  const { data: user } = await axios.get(url, {
    params: {
      key: decoded.key
    }
  })
  return user
}

