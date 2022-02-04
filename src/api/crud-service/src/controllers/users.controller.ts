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

const url = base.users

/**/
@Controller(url)
export class UsersController extends CrudController {
  constructor(
    prisma: PrismaService,
    logger: Logger
  ) {
    super(
      prisma.user as unknown as DelegateType,
      logger,
      url
    )
  }
}

