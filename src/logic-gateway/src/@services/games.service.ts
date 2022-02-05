import {
  Injectable
} from '@nestjs/common'

import {
  ConfigService
} from '@nestjs/config'

import {
  Prisma,
  Game as IGame,
  User
} from '@prisma/client'

import axios from 'axios'

import {
  createGameState,
  PlayerKey,
  initializePlayer,
  GameStateView,
  toView,
  GameState,
} from 'engine'

import hash from 'object-hash'

type Game = Omit<IGame, 'state'> & { state: GameState }

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
      state: createGameState(user, key),
    } as Prisma.GameCreateInput

    const { data: game } = await axios.post<Game>(this.endpoint, payload)

    if (!game) throw new Error('')
    return toView(game.state, 'player_1')
  }

  async joinGame(user: User, key: string): Promise<GameStateView> {
    const { data: game } = await axios.get<Game>(this.endpoint + '/locate', {
      params: {
        key
      }
    })
    if (!game) throw new Error('')
    const state = game.state
    let slot: PlayerKey = 'player_1'
    for (const player of Object.keys(state.players)) {
      if (state.players[player as PlayerKey] === null) {
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
    const games = (await axios.get<Game[]>(this.endpoint + '/search')).data
    return games.map(game => toView(game.state, 'player_1'))
  }

  async getGame(key: string): Promise<GameStateView> {
    const { data: game }= await axios.get<Game>(`${this.endpoint}/locate`, {
      params: {
        key
      }
    })
    if (!game) throw new Error('')
    return toView(game.state, 'player_1')
  }
  
  //async startGame(user: User, key: string): Promise<Game> {

  //}
}

