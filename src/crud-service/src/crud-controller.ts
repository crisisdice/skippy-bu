import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Logger,
} from '@nestjs/common'

import {
  DelegateType
} from './delegate-type'

import {
  createBase,
  locateBase,
  searchBase,
  updateBase,
  deleteBase,
} from './internals'

export const GET = {
  ONE: 'locate',
  MANY: 'search'
}

type InternalArgs<C, D, U, S, R> = {
  logger: Logger
  route: string
  delegate: DelegateType<C, D, U, S, R>
}

/**/
export class CrudController<C, D, U, S, R> {
  createInternal: (body: C) => Promise<R>
  locateInternal: (query: U) => Promise<R>
  searchInternal: (query: S) => Promise<R[]>
  updateInternal: (query: U, body: D) => Promise<R>
  deleteInternal: (query: U) => Promise<void>

  constructor(
    delegate: DelegateType<C, D, U, S, R>,
    logger: Logger,
    route: string,
    validateCreate: (body: C) => C,
    validateLocate: (query: U) => U,
    validateSearch: (query: S) => S,
    validateUpdate: (query: U, body: D) => { where: U, data: D },
    validateDelete: (query: U) => U,
  ) {
    this.createInternal = createBase({ logger, route, delegate, validateCreate })
    this.locateInternal = locateBase({ logger, route, delegate, validateLocate })
    this.searchInternal = searchBase({ logger, route, delegate, validateSearch })
    this.updateInternal = updateBase({ logger, route, delegate, validateUpdate })
    this.deleteInternal = deleteBase({ logger, route, delegate, validateDelete })
  }

  @Post()
  async create(
    @Body() body: C
  ) {
    return await this.createInternal(body)
  }

  @Get(GET.ONE)
  async locate(
    @Query() query: U
  ) {
    return await this.locateInternal(query)
  }

  @Get(GET.MANY)
  async search(
    @Query() query: S
  ) {
    return await this.searchInternal(query)
  }

  @Put()
  async update(
    @Query() query: U,
    @Body() body: D
  ) {
    return await this.updateInternal(query, body)
  }

  @Delete()
  async delete(
    @Query() query: U,
  ) {
      return await this.deleteInternal(query)
  }
}
