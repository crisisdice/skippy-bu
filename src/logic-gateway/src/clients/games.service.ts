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

  async joinGame(user: User, key: string): Promise<Game> {
    let game: Game | null = null

    try {
      game = (await axios.get<Game>(this.endpoint + '/locate', {
        params: {
          key
        }
      })).data
    } catch (e) {
      throw new HttpException('Error finding game to join', 400)
    }
    if (game === null) throw new HttpException('Error finding game to join', 400)

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
    
    try { 
      game = (await axios.put<Game>(this.endpoint, { state }, { params: { key: game.key } })).data
      if (game === null) throw new HttpException('Error joining game', 400)
      return game
    } catch (e) {
      throw new HttpException('Error joining game', 400)
    }
  }
}

