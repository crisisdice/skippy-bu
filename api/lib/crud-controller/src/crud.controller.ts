import {
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe
} from '@nestjs/common'

import {
  CreateType,
  UpdateType,
  BaseService,
} from 'base-service'

const ID = ':id'

/**/
export class CrudController {
  constructor(
    private readonly service: BaseService
  ) {}

  @Post()
  create(@Body() createData: CreateType) {
    return this.service.create(createData)
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(ID)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id)
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
