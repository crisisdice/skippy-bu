import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Logger,
  HttpException,
} from '@nestjs/common'

import {
  UniqueFilter,
  GenericFilter,
  CreatePayload,
  UpdatePayload,
} from './prisma-types'

import {
  DelegateType,
} from './method-types'

import {
  GET 
} from './constants'

import {
  ValidateCreate,
  ValidateUpdate,
  ValidateUnique,
  ValidateSearch,
} from './validation'

import {
  logGetOne,
  logGetMany,
  logPost,
  logPut,
  logDelete,
} from './logging'

/**/
export class CrudController {
  delegate: DelegateType
  logger: Logger
  base: string

  constructor(
    delegate: DelegateType,
    logger: Logger,
    base: string,
  ) {
    this.delegate = delegate
    this.logger = logger
    this.base = base
  }

  @Post()
  async create(
    @Body(ValidateCreate) data: CreatePayload
  ) {
    this.logger.log(logPost(data, this.base))
    return await this.delegate.create({ data })
  }

  @Get(GET.ONE)
  async locate(
    @Query(ValidateUnique) where: UniqueFilter
  ) {
    this.logger.log(logGetOne(where, this.base))
    const result = await this.delegate.findFirst({ where })
    if (result === null) throw new HttpException(
      `${JSON.stringify(where)} did not return any results`, 404
    )
    return result
  }

  @Get(GET.MANY)
  async search(
    @Query(ValidateSearch) where: GenericFilter
  ) {
    this.logger.log(logGetMany(where, this.base))
    return await this.delegate.findMany({ where })
  }

  @Put()
  async update(
    @Query(ValidateUnique) where: UniqueFilter,
    @Body(ValidateUpdate) data: UpdatePayload
  ) {
    // TODO where to handle missing failure.
    this.logger.log(logPut(where, data, this.base))
    return await this.delegate.update({ where, data })
  }

  @Delete()
  async delete(
    @Query(ValidateUnique) where: UniqueFilter,
  ) {
    this.logger.log(logDelete(where, this.base))
    const result = await this.delegate.delete({ where })
    if (result === null) throw new HttpException(
      `${JSON.stringify(where)} did not return any results`, 404
    )
  }
}

