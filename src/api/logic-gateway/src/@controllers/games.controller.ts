import {
  Controller,
  UseGuards,
  Post,
  Response,
  Get,
  Put,
  Body,
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

  @Get('/')
  @UseGuards(AuthGuard)
  async getGames() {
    return await this.gamesService.getGames()
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async createGame(
    @Response({ passthrough: true }) res: IResponse,
  ) {
    return await this.gamesService.createGame(getUser(res))
  }
  
  @Put('/')
  @UseGuards(AuthGuard)
  async joinGame(
    @Body('key') key: string,
    @Response({ passthrough: true }) res: IResponse,
  ) {
    return await this.gamesService.joinGame(getUser(res), key)
  }
}
