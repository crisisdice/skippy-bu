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

import hash from 'object-hash'

import {
  User,
} from '@prisma/client'

import axios from 'axios'

import {
  getMetadata
} from '../@utils/getUser'

import {
  Credentials,
  UserMetadata
} from 'engine'

/**/
@Injectable()
export class UsersService {
  private readonly endpoint: string
  private readonly secret: string
  constructor(
    private readonly configService: ConfigService
  ) {
    this.endpoint = `${this.configService.get<string>('CRUD_URL')}/users`
    this.secret = this.configService.get<string>('SECRET')
  }

  public async register(metadata: UserMetadata): Promise<string> {
    const withHashedPassword = {
      key: await hash(metadata),
      metadata: {
        ...metadata,
        password: await hash(metadata.password) 
      }
    }
    const { data: user } = await axios.post<User>(this.endpoint, withHashedPassword)

    return this.signToken(user.key)
  }

  public async login({ email, password }: Credentials): Promise<string> {
    const { data: user } = await axios.get<User>(
      `${this.endpoint}/by-metadata`, {
      params: {
        email
      }
    })
    if (!user) throw new HttpException('User not found', 404)

    if (!(hash(password) === getMetadata(user).password)) throw new HttpException('Wrong password', 403)
    
    return this.signToken(user.key)
  }

  private signToken(key: string) {
    // TODO sign with private key and share pub key?
    return sign({ key }, this.secret, {
      algorithm: 'HS256',
      expiresIn: '7d',
      issuer: 'skippy-bu',
    })
  }
}

