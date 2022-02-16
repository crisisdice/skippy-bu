import {
  Body,
  Controller,
  Post,
  Put,
} from '@nestjs/common'

import {
  Credentials,
  routes
} from 'skip-models'

import {
  UsersService
} from '../clients'

/**/
@Controller(routes.users)
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {
  }
  
  @Post()
  async register(@Body() body: Credentials) {
    return await this.usersService.register(body)
  }

  @Put()
  async login(@Body() body: Credentials) {
    return await this.usersService.login(body)
  }
}

