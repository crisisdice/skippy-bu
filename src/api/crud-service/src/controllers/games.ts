import {
  Controller,
  Logger,
} from '@nestjs/common'

import {
  CrudController,
  DelegateType,
  base,
} from '../http'

import {
  PrismaService,
} from '../prisma'

const url = base.games

/**/
@Controller(url)
export class GamesController extends CrudController {
  constructor(
    prisma: PrismaService,
    logger: Logger
  ) {
    super(
      prisma.game as unknown as DelegateType,
      logger,
      url
    )
  }
}

