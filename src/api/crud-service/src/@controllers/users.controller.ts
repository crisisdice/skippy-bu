import {
  Controller,
  Get,
  Query
} from '@nestjs/common'

import {
  CrudController
} from 'crud-controller'

import {
  UsersService
} from '../@services'

/**/
@Controller('users')
export class UsersController extends CrudController {
  constructor(
    private readonly usersService: UsersService
  ) {
    super(usersService)
  }

  @Get('by-metadata')
  async getByEmail(@Query('email') email: string) {
    return await this.usersService.findOne({
      where: { email }
    })
  }
}

