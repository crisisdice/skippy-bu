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

  @Get('email')
  async getByEmail(@Query('email') equals: string) {
    return await this.usersService.findOne({
      where: {
        metadata: {
          path: ['email'],
          equals
        }
      }
    })
  }
}

