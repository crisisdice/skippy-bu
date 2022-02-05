import {
  Body,
  Controller,
  Post
} from '@nestjs/common'

import {
  UsersService
} from '../@services'

import { Credentials } from '../engine'

/**/
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {
  }
  
  @Post('register')
  async register(@Body() body: Credentials & { nickname: string }) {
    return await this.usersService.register(body)
  }

  @Post('login')
  async login(@Body() body: Credentials) {
    return await this.usersService.login(body)
  }
}
