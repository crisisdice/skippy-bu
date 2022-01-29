import {
  Controller,
} from '@nestjs/common'

import {
  GamesService
} from '../@services'

/**/
@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService
  ) {}
}
