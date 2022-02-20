import {
  Controller,
  Logger,
} from '@nestjs/common'

import {
  Prisma,
  User,
} from '@prisma/client'

import {
  PrismaController,
  PrismaService,
} from 'prisma-controller'

const url = 'users'

/**/
@Controller(url)
export class UsersController extends PrismaController
  <
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserWhereUniqueInput,
    Prisma.UserWhereInput,
    User
  > {
  constructor(
    prisma: PrismaService,
  ) {
    const logger = new Logger(UsersController.name)
    super(
      prisma.user,
      logger,
      url,
      ['id', 'key', 'email'],
      [],
      ['id'],
    )
  }
}
