import {
  Body,
  Controller,
  Post,
  Put,
  Response,
  Header,
} from '@nestjs/common'

import { Response as Res } from 'express';

import {
  Credentials,
  routes
} from 'skip-models'

import {
  UsersService
} from '../services'

/**/
@Controller(routes.users)
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {
  }
  
  @Post()
  async register(
    @Body() body: Credentials,
    @Response() res: Res) {
    const token = await this.usersService.register(body)
    return res.set({ 'x-access-token': token }).json({ hello: 'world' });
  }

  @Put()
  @Header('Access-Control-Expose-Headers', 'x-access-token')
  async login(
    @Body() body: Credentials,
    @Response() res: Res) {
    console.log(body)
    const token = await this.usersService.login(body)
    return res.set({ 'x-access-token': token }).json({ hello: 'world' });
  }
}

