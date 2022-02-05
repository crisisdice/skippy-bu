import {
  Controller,
  Logger,
} from '@nestjs/common'

import {
  Prisma,
  Game,
} from '@prisma/client'

import {
  PrismaController,
  DelegateType,
  PrismaService,
} from 'prisma-controller'

const key = 'game'
const url = `${key}s`

type C = Prisma.GameCreateInput
type D = Prisma.GameUpdateInput
type U = Prisma.GameWhereUniqueInput
type S = Prisma.GameWhereInput
type R = Game

/**/
@Controller(url)
export class GamesController extends PrismaController<C, D, U, S, R> {
  constructor(
    prisma: PrismaService,
  ) {
    const logger = new Logger(GamesController.name)
    super(
      prisma[key] as unknown as DelegateType<C, D, U, S, R>,
      logger,
      url,
      ['id', 'key'],
      [],
      ['id'],
    )
  }
}
