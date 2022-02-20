import {
  Controller,
  Logger,
} from '@nestjs/common'

import {
  Prisma,
  Game,  // *
} from '@prisma/client'

import {
  PrismaController,
  PrismaService,
} from 'prisma-controller'

const url = 'games' // *

/**/
@Controller(url)
export class GamesController extends PrismaController // *
  <
    Prisma.GameCreateInput, // *
    Prisma.GameUpdateInput, // *
    Prisma.GameWhereUniqueInput, // *
    Prisma.GameWhereInput, // *
    Game // *
  > {
  constructor(
    prisma: PrismaService,
  ) {
    const logger = new Logger(GamesController.name) // *
    super(
      prisma.game, // *
      logger,
      url,
      ['id', 'key'], // *
      [], // *
      ['id'], // *
    )
  }
}
