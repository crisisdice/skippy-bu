import {
  Controller,
} from '@nestjs/common'

import {
  CrudController
} from 'crud-controller'

import {
  GamesService
} from '../@services'

/**/
@Controller('games')
export class GamesController extends CrudController{
  constructor(
    private readonly gamesService: GamesService
  ) {
    super(gamesService)
  }
}
