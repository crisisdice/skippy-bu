import {
  Injectable
} from '@nestjs/common'

import {
  ConfigService
} from '@nestjs/config'

import {
  Prisma,
  Game,
  User
} from '@prisma/client'

import axios from 'axios'

import {
  createGameState,
  GameState,
  PlayerKey,
  initializePlayer,
} from 'engine'

import hash from 'object-hash'

/**/
@Injectable()
export class GamesService {
  private readonly endpoint: string

  constructor(
    private readonly configService: ConfigService
  ) {
    this.endpoint = `${this.configService.get<string>('CRUD_URL')}/games/`
  }

  async createGame(user: User): Promise<Game> {
    const key = user.key
    const payload = {
      creator: { connect: { key } },
      key: hash(key),
      metadata: { test: "test" },
      state: JSON.stringify(createGameState(user)),
    } as Prisma.GameCreateInput

    const { data: game } = await axios.post<Game>(this.endpoint, payload)

    return game
  }

  async joinGame(user: User, key: string): Promise<Game> {
    const { data: game } = await axios.get<Game>(this.endpoint, {
      params: {
        key
      }
    })

    const state = game.state as unknown as GameState
    let slot: PlayerKey
    for (const player in Object.keys(state.players)) {
      if (state.players[player] === null) {
        slot = player as PlayerKey
        break
      }
    }
    if (!slot) throw new Error('Game is full')

    state.players[slot] = initializePlayer(user)

    const { data: updated } = await axios.put<Game>(this.endpoint + game.id, {
      state
    })

    return updated
  }

  async getGames(): Promise<Game[]> {
    return (await axios.get<Game[]>(this.endpoint, {
      params: {}
    })).data
  }
  
  //async startGame(user: User, key: string): Promise<Game> {

  //}
}

