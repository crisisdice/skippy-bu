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
  DelegateType,
  PrismaService,
} from 'prisma-controller'

const key = 'user'
const url = `${key}s`

type C = Prisma.UserCreateInput
type D = Prisma.UserUpdateInput
type U = Prisma.UserWhereUniqueInput
type S = Prisma.UserWhereInput
type R = User

/**/
@Controller(url)
export class UsersController extends PrismaController<C, D, U, S, R> {
  constructor(
    prisma: PrismaService,
  ) {
    const logger = new Logger(UsersController.name)
    super(
      prisma[key] as unknown as DelegateType<C, D, U, S, R>,
      logger,
      url,
      ['id', 'key', 'email'],
      [],
      ['id'],
    )
  }
}
