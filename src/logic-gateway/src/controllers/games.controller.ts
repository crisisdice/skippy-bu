import {
  Controller,
  UseGuards,
  Post,
  Response,
  Get,
} from '@nestjs/common'

import {
  GamesService,
  AuthGuard,
} from '../clients'

import {
  Response as IResponse
} from 'express'

import {
  getUser
} from '../utils'

import {
  routes
} from 'skip-models'

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

