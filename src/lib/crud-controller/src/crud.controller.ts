import {
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query
} from '@nestjs/common'

import {
  BaseService,
} from 'base-service'

import {
  CreateInput,
  UpdateType,
  Query as IQuery
} from 'prisma-service'

const ID = ':id'

/**/
export class CrudController {
  constructor(
    private readonly service: BaseService
  ) {}

  @Post()
  create(@Body() createData: CreateInput) {
    return this.service.create(createData)
  }

  @Get()
  findByQuery(@Query() query: IQuery) {
    return this.service.findOne({ where: query })
  }

  @Get('all')
  findAll() {
    return this.service.findAll()
  }

  @Get(ID)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne({ where: { id } })
  }

  @Put(ID)
  updateById(@Param('id', ParseIntPipe) id: number, @Body() updateData: UpdateType) {
    return this.service.updateById(id, updateData)
  }

  @Delete(ID)
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteById(id)
  }
}
