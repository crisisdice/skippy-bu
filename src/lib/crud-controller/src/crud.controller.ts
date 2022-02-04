import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query as QueryFilter,
  Logger,
} from '@nestjs/common'

import {
  BaseService,
} from 'base-service'

import {
  Create,
  Update,
  Query,
} from 'prisma-service'

import {
  ValidationPipe
} from './validation.pipe'

/**/
export class CrudController {
  readonly service: BaseService
  readonly logger: Logger
  constructor(
    _service: BaseService,
    _logger: Logger
  ) {
    this.service = _service
    this.logger = _logger
  }

  @Post()
  create(
    @Body() createData: Create
  ) {
    this.logger.log('Executing create()')

    return this.service.create(createData)
  }

  @Get()
  findOne(
    @QueryFilter(ValidationPipe) query: Query
  ) {
    this.logger.log('Executing findOne()')

    return this.service.findOne(query)
  }

  @Get('all')
  findAll() {
    this.logger.log('Executing findAll()')
    return this.service.findAll()
  }

  @Put()
  update(
    @QueryFilter(ValidationPipe) query: Query,
    @Body() updateData: Update
  ) {
    this.logger.log('Executing update()')
    return this.service.update(query, updateData)
  }

  @Delete()
  delete(
    @QueryFilter(ValidationPipe) query: Query,
  ) {
    this.logger.log('Executing delete()')
    return this.service.delete(query)
  }
}

