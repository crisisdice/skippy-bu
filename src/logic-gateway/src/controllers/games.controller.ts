import {
  Controller,
  UseGuards,
  Post,
  Response,
  Get,
  Put,
  Body,
  Query,
} from '@nestjs/common'

import {
  GamesService
} from '../services'

import {
  Response as IResponse
} from 'express'

import {
  AuthGuard,
  getUser
} from '../utils'

/**/
@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async getGame(
    @Query('key') key: string
  ) {
    return await this.gamesService.getGame(key)
  }

  @Get('/all')
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
