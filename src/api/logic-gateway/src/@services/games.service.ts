import {
  HttpException,
  Injectable
} from '@nestjs/common'

import {ConfigService} from '@nestjs/config'

import { Prisma, Game, User} from '@prisma/client'

import axios from 'axios'

/**/
@Injectable()
export class GamesService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  async createGame(user: User) {
    const key = user.key
    const payload = {
      creator: { connect: { key } },
      key,
      metadata: { test: "test" },
      state: {},
      playerMapping: {}
    } as Prisma.GameCreateInput
    const { data: game } = await axios.post<Game>('http://localhost:3000/games', payload)

    return game
  }
}

