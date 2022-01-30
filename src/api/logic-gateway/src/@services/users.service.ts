import {
  HttpException,
  Injectable
} from '@nestjs/common'

import {ConfigService} from '@nestjs/config'

import { sign } from 'jsonwebtoken'

import { User } from '@prisma/client'

import axios from 'axios'

/**/
@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  async login(data: { email: string, password: string }) {
    const { email, password } = data
    const { data: user } = await axios.get<User>('http://localhost:3000/users', {
      params: {
        email
      }
    })

    const tokenInfo = {
      key: user.key
    }

    //const token = sign(tokenInfo, this.configService.get<string>('privateKey') || 'secret', {
    const token = sign(tokenInfo, 'secret', {
      algorithm: 'HS256',
      //algorithm: 'RS256',
      expiresIn: '7d',
      issuer: 'skippy-bu',
    })

    if (user.password === password) return token

    throw new HttpException('', 403)
  }
}

