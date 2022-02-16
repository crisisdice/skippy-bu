import {
  Body,
  Controller,
  Post,
  Put,
} from '@nestjs/common'

import {
  UsersService
} from '../clients'

import {
  Credentials,
  routes
} from 'skip-models'

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

  @Put('login')
  async login(@Body() body: Credentials) {
    return await this.usersService.login(body)
  }
}

