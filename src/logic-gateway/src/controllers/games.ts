import {
  Controller,
  UseGuards,
  Post,
  Response,
  Get,
} from '@nestjs/common'

import {
  Response as IResponse
} from 'express'

import {
  routes
} from 'skip-models'

import {
  getUser,
  AuthGuard
} from '../utils'

import {
  GamesService,
} from '../services'

/**/
@Controller(routes.games)
export class GamesController {
  constructor(
    private readonly gamesService: GamesService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getGames() {
    return await this.gamesService.getGames()
  }

  @Post()
  @UseGuards(AuthGuard)
  async createGame(
    @Response({ passthrough: true }) res: IResponse,
  ) {
    return await this.gamesService.createGame(getUser(res))
  }
}

