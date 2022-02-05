import {
  Controller,
  Logger,
} from '@nestjs/common'

import {
  CrudController,
} from '../crud-controller'

import {
  DelegateType,
} from '../types'

import {
  PrismaService,
} from '../prisma'

import {
  Prisma,
  Game,
} from '@prisma/client'

const key = 'game'
const url = `${key}s`

type C = Prisma.GameCreateInput
type D = Prisma.GameUpdateInput
type U = Prisma.GameWhereUniqueInput
type S = Prisma.GameWhereInput
type R = Game

const validateCreate = (logger: Logger, route: string) => {
  return (body: C) => body
}

const validateLocate = (logger: Logger, route: string) => {
  return (query: U) => query
}

const validateSearch = (logger: Logger, route: string) => {
  return (query: S) => query
}

const validateUpdate = (logger: Logger, route: string) => {
  return (query: U, body: D) => { return { where: query, data: body } }
}

const validateDelete = (logger: Logger, route: string) => {
  return (query: U) => query
}

/**/
@Controller(url)
export class GamesController extends CrudController<C, D, U, S, R> {
  constructor(
    prisma: PrismaService,
    logger: Logger
  ) {
    super(
      prisma[key] as unknown as DelegateType<C, D, U, S, R>,
      validateCreate,
      validateLocate,
      validateSearch,
      validateUpdate,
      validateDelete,
      logger,
      url
    )
  }
}

