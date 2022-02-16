import {
  Injectable
} from '@nestjs/common'

import {
  ConfigService
} from '@nestjs/config'

import hash from 'object-hash'

import axios from 'axios'

import {
  createGameState,
  routes,
  Game,
  User,
  GameCreateInput,
} from 'skip-models'

/**/
@Injectable()
export class GamesService {
  private readonly endpoint: string

  constructor(
    private readonly configService: ConfigService
  ) {
    this.endpoint = `${this.configService.get<string>('CRUD_URL')}${routes.games}`
  }

  async createGame(user: User): Promise<Game> {
    const key = hash(user.key)
    const payload = {
      creator: { connect: { key: user.key } },
      key,
      metadata: { test: "test" },
      state: createGameState(user, key),
    } as GameCreateInput

    try {
      //TODO error handling
      const { data: game } = await axios.post<Game>(this.endpoint, payload)
      if (!game) throw new Error('')
      return game
    } catch (e) {
      throw e
    }
  }

  async getGames(): Promise<Game[]> {
    try {
      //TODO share routes between client, logic, and crud
      return (await axios.get<Game[]>(this.endpoint + '/search')).data
    } catch (e) {
      throw e
    }
  }
}

