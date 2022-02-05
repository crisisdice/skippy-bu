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
} from './types'

import {
  setupCreate,
  setupDelete,
  setupLocate,
  setupSearch,
  setupUpdate
} from './internals'

import {
  GET
} from './constants'

import {
  setupValidateCreate,
  setupValidateLocate,
  setupValidateSearch,
  setupValidateUpdate,
  setupValidateDelete,
} from './validations'

/**/
export class PrismaController<C, D, U, S, R> {
  createInternal: (body: C) => Promise<R>
  locateInternal: (query: U) => Promise<R>
  searchInternal: (query: S) => Promise<R[]>
  updateInternal: (query: U, body: D) => Promise<R>
  deleteInternal: (query: U) => Promise<void>

  constructor(
    delegate: DelegateType<C, D, U, S, R>,
    logger: Logger,
    route: string,
    // TODO ignore all others
    uniqueKeys: (keyof U)[],
    requiredKeys: (keyof C)[],
    numericalKeys: (keyof U)[],
  ) {
    const shared = { logger, route, delegate }

    this.createInternal = setupCreate({ ...shared, validateCreate: setupValidateCreate<C>(requiredKeys) })
    this.locateInternal = setupLocate({ ...shared, validateLocate: setupValidateLocate<U>(uniqueKeys, numericalKeys) })
    this.searchInternal = setupSearch({ ...shared, validateSearch: setupValidateSearch<S>([]) }) // TODO 
    this.updateInternal = setupUpdate({ ...shared, validateUpdate: setupValidateUpdate<U, D>(uniqueKeys, numericalKeys) })
    this.deleteInternal = setupDelete({ ...shared, validateDelete: setupValidateDelete<U>(uniqueKeys, numericalKeys) })
  }

  @Post()
  async create(
    @Body() body: C
  ): Promise<R> {
    return await this.createInternal(body)
  }

  @Get(GET.ONE)
  async locate(
    @Query() query: U
  ): Promise<R> {
    return await this.locateInternal(query)
  }

  @Get(GET.MANY)
  async search(
    @Query() query: S
  ): Promise<R[]> {
    return await this.searchInternal(query)
  }

  @Put()
  async update(
    @Query() query: U,
    @Body() body: D
  ): Promise<R> {
    return await this.updateInternal(query, body)
  }

  @Delete()
  async delete(
    @Query() query: U,
  ): Promise<void> {
    return await this.deleteInternal(query)
  }
}
