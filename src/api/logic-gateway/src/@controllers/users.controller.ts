import {
  Body,
  Controller,
  Post
} from '@nestjs/common'

import {
  UsersService
} from '../@services'

import { Prisma } from '@prisma/client'

/**/
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {
  }
  
  @Post('register')
  async register(@Body() body: Prisma.UserCreateInput) {
    return await this.usersService.register(body)
  }

  @Post('login')
  async login(@Body() body: { email: string, password: string }) {
    return await this.usersService.login(body)
  }
}
