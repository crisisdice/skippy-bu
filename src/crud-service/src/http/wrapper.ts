import {
  Logger,
} from '@nestjs/common'

import {
  BaseService,
} from './service'

import {
  UniqueFilter,
  GenericFilter,
  CreatePayload,
  UpdatePayload,
  DelegateType,
} from './types'

import {
  logGetOne,
  logGetMany,
  logPost,
  logPut,
  logDelete,
} from './logging'

export class ServiceWrapper {
  service: BaseService
  logger: Logger
  base: string

  constructor(
    delegate: DelegateType,
    logger: Logger,
    base: string,
  ) {
    this.service = new BaseService(delegate)
    this.logger = logger
    this.base = base
  }

  async POST(body: CreatePayload) {
    this.logger.log(logPost(body, this.base))
    return this.service.create(body)
  }

  async GET_ONE(query: UniqueFilter) {
    this.logger.log(logGetOne(query, this.base))
    return this.service.locate(query)
  }

  async GET_MANY(query: GenericFilter) {
    this.logger.log(logGetMany(query, this.base))
    return this.service.search(query)
  }

  async PUT(query: UniqueFilter, body: UpdatePayload) {
    this.logger.log(logPut(query, body, this.base))
    return this.service.update(
      query,
      body,
    )
  }

  async DELETE(query: UniqueFilter) {
    this.logger.log(logDelete(query, this.base))
    return this.service.delete(query)
  }
}

