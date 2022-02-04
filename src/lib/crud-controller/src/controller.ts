import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query as RequestQuery,
  Logger,
} from '@nestjs/common'

import {
  UniqueFilter,
  GenericFilter,
  CreatePayload,
  UpdatePayload,
  DelegateType,
} from 'crud-service'

import {
  endpoints
} from 'api-constants'

import {
  ValidateCreate,
  ValidateUpdate,
  ValidateUnique,
  ValidateSearch,
} from './validation.pipe'

import {
  ServiceWrapper
} from './service-wrapper'

/**/
export class CrudController {
  _: ServiceWrapper
  constructor(
    delegate: DelegateType,
    logger: Logger,
    base: string,
  ) {
    this._ = new ServiceWrapper(delegate, logger, base)
  }

  @Post()
  create(
    @Body(ValidateCreate) body: CreatePayload
  ) {
    return this._.POST(body)
  }

  @Get(endpoints.locate)
  locate(
    @RequestQuery(ValidateUnique) query: UniqueFilter
  ) {
    return this._.GET_ONE(query)
  }

  @Get(endpoints.search)
  search(
    @RequestQuery(ValidateSearch) query: GenericFilter
  ) {
    return this._.GET_MANY(query)
  }

  @Put()
  update(
    @RequestQuery(ValidateUnique) query: UniqueFilter,
    @Body(ValidateUpdate) body: UpdatePayload
  ) {
    return this._.PUT(query, body)
  }

  @Delete()
  delete(
    @RequestQuery(ValidateUnique) query: UniqueFilter,
  ) {
    return this._.DELETE(query)
  }
}

