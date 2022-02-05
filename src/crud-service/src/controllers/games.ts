import {
  Controller,
  Logger,
} from '@nestjs/common'

import {
  CrudController,
} from '../crud-controller'

import {
  PrismaService,
} from '../prisma'

import {
  URL
} from '../constants'

import {
  DelegateType
} from '../method-types'

const key = 'game'
const url = URL[key]

/**/
@Controller(url)
export class GamesController extends CrudController {
  constructor(
    prisma: PrismaService,
    logger: Logger
  ) {
    super(
      prisma[key] as unknown as DelegateType,
      logger,
      url
    )
  }
}

