import {
  Body,
  Controller,
  Post
} from '@nestjs/common'

import {
  UsersService
} from '../@services'

/**/
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {
  }

  @Post('/login')
  async login(@Body() body: { email: string, password: string }) {
    return await this.usersService.login(body)
  }
}
