import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Request, Response } from 'express'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import { verify } from 'jsonwebtoken'

export type Token = {
  key: string
  iat: number,
  exp: number,
  iss: string
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>()
      const res = context.switchToHttp().getResponse<Response>()
      const token = req.headers?.authorization?.split(' ')?.[1]

      if (!token) {
        return false
      }

      const decoded = verify(token, 'secret') as Token

      const { data: user } = await axios.get('http://localhost:3000/users', {
        params: {
          key: decoded.key
        }
      })

      console.log(user)

      if (!user) {
        return false
      }

      res.locals.user = user

      return true
    } catch (e) {
      return false
    }
  }
}
