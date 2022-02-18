import {
  HttpException,
  Injectable
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
  initalizeGameState,
  PlayerKey,
  initializePlayer,
} from 'skip-models'

//TODO share routes between client, logic, and crud
//TODO error handling
//TODO upgrade directly to ws

/**/
@Injectable()
export class GamesService {
  private readonly endpoint: string

  constructor(
    private readonly configService: ConfigService
  ) {
    this.endpoint = `${this.configService.get<string>('CRUD_URL')}/${routes.games}`
  }

  async createGame(user: User): Promise<Game> {
    const key = hash(user.key)
    const payload: GameCreateInput = {
      creator: { connect: { key: user.key } },
      key,
      metadata: { test: "test" },
      state: initalizeGameState(user),
    }
    try {
      const { data: game } = await axios.post<Game>(this.endpoint, payload)
      if (!game) throw new HttpException('Error creating game', 400)
      return game
    } catch (e) {
      throw e
    }
  }

  async getGames(): Promise<Game[]> {
    try {
      return (await axios.get<Game[]>(this.endpoint + '/search')).data
    } catch (e) {
      throw e
    }
  }

}

