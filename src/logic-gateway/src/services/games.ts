import {
  HttpException,
  Injectable,
  Logger
} from '@nestjs/common'

import {
  ConfigService
} from '@nestjs/config'

import hash from 'object-hash'

import axios from 'axios'

import {
  routes,
  Game,
  User,
  GameCreateInput,
} from 'skip-models'

import {
  initalizeGameState,
} from 'skip-engine'

/**/
@Injectable()
export class GamesService {
  private readonly endpoint: string
  private readonly logger: Logger

  constructor(
    configService: ConfigService,
  ) {
    this.endpoint = `${configService.get<string>('CRUD_URL')}/${routes.games}`
    this.logger = new Logger(GamesService.name)
  }

  async createGame(user: User): Promise<Game> {
    const key = hash(user.key)
    const payload: GameCreateInput = {
      creator: { connect: { key: user.key } },
      key,
      metadata: {},
      state: initalizeGameState(user),
    }
    try {
      const { data: game } = await axios.post<Game>(this.endpoint, payload)
      if (!game) throw new HttpException('Error creating game', 400)
      return game
    } catch (e) {
      this.logger.error(JSON.stringify(e))
      throw new HttpException('Error creating game', 400)
    }
  }

  async getGames(): Promise<Game[]> {
    try {
      return (await axios.get<Game[]>(this.endpoint + '/search')).data
    } catch (e) {
      this.logger.error(JSON.stringify(e))
      throw new HttpException('Error finding games', 400)
    }
  }
}

