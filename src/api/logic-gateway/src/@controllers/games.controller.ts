import {
  Controller,
  UseGuards,
  Post,
  Response
} from '@nestjs/common'

import {
  GamesService
} from '../@services'

import {
  Response as IResponse
} from 'express'

import {
  AuthGuard
} from '../@pipelines/auth.guard'

import {
  getUser
} from '../@utils/getUser'

/**/
@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService
  ) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createGame(
    @Response({ passthrough: true }) res: IResponse,
  ) {
    await this.gamesService.createGame(getUser(res))
  }
}
