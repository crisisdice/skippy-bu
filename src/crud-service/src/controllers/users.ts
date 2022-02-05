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

const key = 'user'
const url = URL[key]

/**/
@Controller(url)
export class UsersController extends CrudController {
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

