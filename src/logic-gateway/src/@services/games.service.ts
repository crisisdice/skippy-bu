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
  PlayerKey,
  initializePlayer,
  GameStateView,
  toView,
} from 'engine'

import hash from 'object-hash'

/**/
@Injectable()
export class GamesService {
  private readonly endpoint: string

  constructor(
    private readonly configService: ConfigService
  ) {
    this.endpoint = `${this.configService.get<string>('CRUD_URL')}/games`
  }

  async createGame(user: User): Promise<GameStateView> {
    const key = hash(user.key)
    const payload = {
      creator: { connect: { key: user.key } },
      key,
      metadata: { test: "test" },
      state: JSON.stringify(createGameState(user, key)),
    } as Prisma.GameCreateInput

    const { data: game } = await axios.post<Game>(this.endpoint, payload)

    if (!game || !game?.state) throw new Error('')

    return toView(JSON.parse(game.state.toString()), 'player_1')
  }

  async joinGame(user: User, key: string): Promise<GameStateView> {
    const { data: game } = await axios.get<Game>(this.endpoint + '/locate', {
      params: {
        key
      }
    })
    if (!game || !game?.state) throw new Error('')
    const state = JSON.parse(game.state.toString()) //as unknown as GameState
    let slot: PlayerKey = 'player_1'
    for (const player of Object.keys(state.players)) {
      if (state.players[player] === null) {
        slot = player as PlayerKey
        break
      }
    }
    if (!slot) throw new Error('Game is full')

    state.players[slot] = initializePlayer(user)

    await axios.put<Game>(this.endpoint, { state }, { params: { key } })

    return toView(state, slot)
  }

  async getGames(): Promise<GameStateView[]> {
    const games = (await axios.get<Game[]>(`${this.endpoint}/search`)).data

    return games.map(game => toView(JSON.parse(game?.state?.toString() ?? ''), 'player_1'))
  }

  async getGame(key: string): Promise<GameStateView> {
    const { data: game }= await axios.get<Game>(`${this.endpoint}/locate`, {
      params: {
        key
      }
    })
    if (!game || !game?.state) throw new Error('')

    return toView(JSON.parse(game.state.toString()), 'player_1')
  }
  
  //async startGame(user: User, key: string): Promise<Game> {

  //}
}

