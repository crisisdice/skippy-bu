import {
  Controller,
  Logger,
} from '@nestjs/common'

import {
  CrudController
} from 'crud-controller'

import {
  base
} from 'api-constants'

import {
  PrismaService,
  DelegateType
} from 'prisma-service'

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

