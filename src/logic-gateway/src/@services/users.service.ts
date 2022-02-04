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
  Credentials,
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

  public async register(credentials: Credentials): Promise<string> {
    const { email, password, nickname } = credentials
    //TODO get this down to one fetch
    const { data: sameEmail } = await axios.get<User>(
      this.endpoint, {
      params: {
        email
      }
    })
    const { data: sameNickname } = await axios.get<User>(
      this.endpoint, {
      params: {
        nickname
      }
    })

    if (!!sameEmail) throw new HttpException('Email taken', 400)
    if (!!sameNickname) throw new HttpException('Nickname taken', 400)

    const { data: user } = await axios.post<User>(this.endpoint, {
      key: hash(credentials),
      password: hash(password),
      metadata: {},
      email,
      nickname,
    })

    return this.signToken(user.key)
  }

  public async login({ email, password }: Credentials): Promise<string> {
    if (!email || !password) throw new HttpException('', 400)

    const { data: user } = await axios.get<User>(
      this.endpoint, {
      params: {
        email
      }
    })
    if (!user) throw new HttpException('User not found', 404)
    if (!(hash(password) === user.password)) throw new HttpException('Wrong password', 403)
    
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

