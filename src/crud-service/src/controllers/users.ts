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

