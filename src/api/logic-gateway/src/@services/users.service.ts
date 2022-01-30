import {
  HttpException,
  Injectable
} from '@nestjs/common'

import {
  ConfigService
} from '@nestjs/config'

import {
  sign
} from 'jsonwebtoken'

import {
  compare,
  hash,
  genSalt
} from 'bcryptjs'

import {
  Prisma,
  User,
} from '@prisma/client'

import axios from 'axios'

import {
  getMetadata
} from '../@utils/getUser'

/**/
@Injectable()
export class UsersService {
  private readonly endpoint: string
  constructor(
    private readonly configService: ConfigService
  ) {
    this.endpoint = `${this.configService.get<string>('CRUD_URL')}/users`
  }

  async register(data: Prisma.UserCreateInput) {
    const metadata = getMetadata(data as User)
    const withHashedPassword = {
      ...data,
      metadata: {
        ...metadata,
        password: await hash(metadata.password, (await genSalt(10))) 
      }
    }
    const { data: user } = await axios.post<User>(this.endpoint, withHashedPassword)
    return user
  }

  async login(data: { email: string, password: string }) {
    const { email, password } = data
    const { data: user } = await axios.get<User>(
      `${this.endpoint}/by-metadata`, {
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

    if (compare(password, getMetadata(user).password)) return token

    throw new HttpException('', 403)
  }
}

